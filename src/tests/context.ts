import { type Context } from 'aws-lambda'

const context: Context = {
  functionName: 'myFunction',
  functionVersion: '1',
  callbackWaitsForEmptyEventLoop: true,
  invokedFunctionArn: '',
  memoryLimitInMB: '128',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: () => 1000,
  done: () => {},
  fail: () => {},
  succeed: () => {}
}

export default context
