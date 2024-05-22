import { NetworkProvider, sleep } from "@ton/blueprint";
import { Counter } from "../wrappers/Counter";
import { Address, toNano } from "@ton/core";



export async function run(provider: NetworkProvider) {

    const counter = provider.open(Counter.fromAddress(Address.parse("EQA2Eaj1L485sFU_cdkaJvPS51ig2RleeEeQfar2jsfzr67Q")));

    const counterBefore = await counter.getCounter();
    console.log("counter before:", counterBefore);

    await counter.send(
        provider.sender(),
        {
            value: toNano("0.05")
        },
        {
            $$type: "Add",
            queryId: 0n,
            amount: 1n
        }
    );

    let counterAfter = await counter.getCounter();
    let attempt = 1;
    while(counterAfter === counterBefore) {
        console.log("incrementing counter, attempt#", attempt);
        await sleep(2000);
        counterAfter = await counter.getCounter();
        attempt++;
    }

    console.log("counter after", counterAfter);
    
}