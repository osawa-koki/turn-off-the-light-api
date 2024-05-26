import {
  type APIGatewayProxyHandler,
  type APIGatewayProxyResult,
} from 'aws-lambda'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

dotenv.config()

export const lambdaHandler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const token = process.env.TOKEN
  const secretStr = process.env.SECRET
  if (token == null || secretStr == null) {
    console.log('Please set TOKEN and SECRET in .env file')
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Please set TOKEN and SECRET in .env file'
      })
    }
  }
  const nonce = uuidv4()
  const t = Math.round(new Date().getTime())

  const string_to_sign = `${token}${t}${nonce}`
  const secret = Buffer.from(secretStr, 'utf-8')

  const sign = Buffer.from(
    crypto
      .createHmac('sha256', secret)
      .update(string_to_sign)
      .digest('base64')
  )

  // Build api header JSON
  const apiHeader = {
    Authorization: token,
    'Content-Type': 'application/json',
    charset: 'utf8',
    t: t.toString(),
    sign: sign.toString('utf-8'),
    nonce: nonce
  }

  // https://api.switch-bot.com/v1.1/devices
  // Get device ID from the response

  const deviceID = process.env.DEVICE_ID
  if (deviceID == null) {
    console.log('Please set DEVICE_ID in .env file')
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Please set DEVICE_ID in .env file'
      })
    }
  }

  const url = `https://api.switch-bot.com/v1.0/devices/${deviceID}/commands`
  const data = { command: 'turnOff' }

  const response = await fetch(url, {
    method: 'POST',
    headers: apiHeader,
    body: JSON.stringify(data)
  })
  console.log(response.json())

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Successfully sent turn off command'
    })
  }
}
