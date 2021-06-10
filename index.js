import dotenv from 'dotenv';
import {start_fei_price} from "./sub_bots/fei_price.js";
import {start_tribe_price} from "./sub_bots/tribe_price.js";
import {start_tribe_holders} from "./sub_bots/tribe_holders.js";
import {start_pcv_stats} from "./sub_bots/pcv_stats.js";

dotenv.config();


start_fei_price(process.env.fei_price_token);
start_tribe_price(process.env.tribe_price_token);
start_pcv_stats(process.env.pcv_stats_token);
start_tribe_holders(process.env.tribe_holders_token);

console.log(`bloxy_apikey: ${process.env.bloxy_apikey}`);
