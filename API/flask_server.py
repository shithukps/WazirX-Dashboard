from datetime import datetime
from pytz import timezone
import time
import pandas as pd
from flask import Flask, json, request
from flask_cors import CORS, cross_origin
from WazirX_Client.client import Client

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def getINROrders(client, symbol):
    response = ()
    while True:
        try:
            response = client.send("all_orders", {
                "limit": 1000, "symbol": symbol+'inr', "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
            if response[0] == 200 or response[0] == 400:
                break
        except:
            pass
        time.sleep(1)
    return response


def getUSDTOrders(client, symbol):
    response = ()
    while True:
        try:
            response = client.send("all_orders", {
                "limit": 1000, "symbol": symbol+'usdt', "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
            if response[0] == 200 or response[0] == 400:
                break
        except:
            pass
        time.sleep(1)
    return response


def getOrders(client, symbol):
    inrTotal = 0.00
    usdtTotal = 0.00
    execQty = 0.00
    response = ()
    response = getINROrders(client, symbol)
    if response[0] == 200 and len(response[1]) > 0:
        for item in response[1]:
            if item["side"] == 'buy':
                inrTotal = inrTotal + (float(item["price"])
                                       * float(item["executedQty"]))
                execQty = execQty + float(item["executedQty"])
            else:
                inrTotal = inrTotal - (float(item["price"])
                                       * float(item["executedQty"]))
                execQty = execQty - float(item["executedQty"])
    return [symbol, execQty, inrTotal + usdtTotal]


def getFunds(client):
    symbols = []
    response = client.send("funds_info", {
        "limit": 1000, "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
    if(response and response[0] == 200):
        for item in response[1]:
            if item['asset'] != 'inr' and item['asset'] != 'usdt' and item['free'] != '0.0':
                symbols.append(item['asset'])
    else:
        getFunds(client)
    return symbols


def getCurrentPrices(client, funds):
    prices = []
    for ind in funds.index:
        while True:
            try:
                response = client.send("ticker", {
                    "limit": 1000, "symbol": funds['Token'][ind]+'inr', "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
                if response[0] != 200:
                    time.sleep(0.3)
                    raise RuntimeError
                elif response[0] == 200 and response[1] == {}:
                    time.sleep(0.3)
                    raise RuntimeError
                else:
                    prices.append(float(response[1]['lastPrice']))
                    print(funds['Token'][ind]+" - INR : " +
                          str(float(response[1]['lastPrice'])))
                break
            except:
                try:
                    response = client.send("ticker", {
                        "limit": 1000, "symbol": funds['Token'][ind]+'usdt', "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
                    time.sleep(1)
                    usdtResponse = client.send("ticker", {
                        "limit": 1000, "symbol": 'usdtinr', "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
                    prices.append(float(response[1]['lastPrice'])
                                  * float(usdtResponse[1]['lastPrice']))
                    print(funds['Token'][ind]+" - USDT : " +
                          str(float(response[1]['lastPrice'])))
                    print(funds['Token'][ind]+" - INR : " + str(float(response[1]['lastPrice'])
                                                                * float(usdtResponse[1]['lastPrice'])))
                    break
                except:
                    time.sleep(1)
                    pass
                    
        time.sleep(1)
    return prices


@app.route('/get_funds', methods=['POST'])
@cross_origin()
def get_funds():
    body = request.get_json()
    api_key = body["api_key"]
    api_secret = body["api_secret"]
    client = Client(api_key=api_key, secret_key=api_secret)
    symbols = []
    while True:
        symbols = getFunds(client)
        if len(symbols) != 0:
            break
    fundsDf = pd.DataFrame(
        symbols, columns=['Token'])
    print("Tokens Fetched")
    print(fundsDf)
    print("--------------------------")
    prices = getCurrentPrices(client, fundsDf)
    fundsDf['Current_Price'] = prices
    fundsDf = fundsDf.sort_values('Token').reset_index(drop=True)
    print("Fetching Orders")
    orders = []
    for coinSymbol in symbols:
        response = getOrders(client,coinSymbol)
        orders.append(response)
        time.sleep(1)
    orderDf = pd.DataFrame(
        orders, columns=['Token', 'Holdings', 'Investment'])
    orderDf = orderDf.sort_values('Token').reset_index(drop=True)
    fundsDf["Holdings"] = orderDf['Holdings']
    fundsDf['Current_Value'] = fundsDf["Holdings"] * fundsDf['Current_Price']
    fundsDf["Total_Investment"] = orderDf['Investment']
    fundsDf["Avg_Buy_Price"] = fundsDf["Total_Investment"] / fundsDf["Holdings"]
    fundsDf["Gain"] = fundsDf['Current_Value'] - fundsDf["Total_Investment"]
    fundsDf["Gain_Perc"] = (fundsDf['Gain'] / fundsDf["Total_Investment"]) * 100
    fundsDf = fundsDf.round(3)
    print("--------------------------")
    print("Fund Details.")
    print("--------------------------")
    print(fundsDf)
    fundsDf = fundsDf[fundsDf["Total_Investment"] > 0].reset_index(drop=True)
    print("--------------------------")
    print("Updated Fund Details.")
    print("--------------------------")
    print(fundsDf)
    total_investment = fundsDf["Total_Investment"].sum()
    total_gain = fundsDf["Gain"].sum()
    gain_percentage = (total_gain/total_investment)*100
    total_value = fundsDf["Current_Value"].sum()
    funds_json = fundsDf.to_json(force_ascii=False, orient='records', indent=2)
    return_json = {}
    return_json["Time_Updated"] = datetime.now(timezone("Asia/Kolkata")).strftime('%Y-%m-%d %H:%M:%S')
    return_json['Total_Investment'] = total_investment
    return_json['Total_Gain'] = total_gain
    return_json['Gain_Percentage'] = gain_percentage
    return_json['Total_Value'] = total_value
    return_json["Funds"] = json.loads(funds_json)
    if(funds_json):
        return return_json
    else:
        return json.dumps({'funds_json': 'false'})

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    body = request.get_json()
    api_key = body["api_key"]
    api_secret = body["api_secret"]
    clientx = Client(api_key=api_key, secret_key=api_secret)
    response = clientx.send("funds_info", {
        "limit": 10, "recvWindow": 10000, "timestamp": int(time.time() * 1000)})
    try:
        if response[0] == 200 :
            return json.dumps({'login':'success'})
        else :
            return json.dumps({'login':'failure'})
    except:
            return json.dumps({'login':'failure'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
