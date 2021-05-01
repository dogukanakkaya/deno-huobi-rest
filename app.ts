import Rest, { Account } from './huobi/Rest.ts'

const accessKey: string = Deno.env.get("ACCESS_KEY")!;
const secretKey: string = Deno.env.get("SECRET_KEY")!;

const huobi = new Rest({accessKey, secretKey});

const startDate = new Date();
startDate.setTime(startDate.getTime() - 24 * 60 * 60 * 1000 * 60); // subtract 60 days

const { data: uid } = await huobi.uid();

const { data: accounts } = await huobi.accounts()
const a1 = accounts.find((account: Account) => account.type === 'spot' && account.state === 'working')
const a2 = accounts.find((account: Account) => account.type === 'point' && account.state === 'working')

const { data: balance } = await huobi.accountBalance(a1.id)

const { data: accountHistory } = await huobi.accountHistory({
    'account-id': a1.id
})

const { data: orderHistory } = await huobi.orderHistory({
    'start-time': startDate.getTime().toString()
})

const { data: openOrders } = await huobi.openOrders({
    'account-id': a1.id,
    'symbol': 'ethusdt'
})