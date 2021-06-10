import {db} from "../shared/db.js";
import Discord from "discord.js";
import axios from "axios";

const client = new Discord.Client();

client.on('ready',()=>{
  console.log(`${client.user.tag} now online`)
})


const get_tribe_holders = async ()=>{
  return axios.get(`https://api.bloxy.info/token/token_holders_list?token=0x956F47F50A910163D8BF957Cf5846D573E7f87CA&key=${process.env.bloxy_apikey}&format=table&limit=100000`).then((info)=>{
    const data = info.data
    const holders = data.filter((x)=>{return x[2] > 250})
    const holders_small = data.filter((x)=>{return x[2] > 100})
    db.put('last_tribe_holders',holders.length);
    db.put('last_tribe_holders_small',holders_small.length);
  })
}

export const start_tribe_holders = async (token) => {
  client.login(token).then(async ()=>{
    await update();
    await tick();
  })
}

const tick = async () =>{
  db.get('last_tribe_holders').then((holders)=>{
    db.get('last_tribe_holders_small').then((holders_small)=>{
      client.user.setActivity(`holders > 250 | 100`)
    client.guilds.cache.array().forEach((guild)=>{
      guild.me.setNickname(`! ${holders.toLocaleString()} | ${holders_small.toLocaleString()}`)
    })
      })
  }).catch(()=>{});
}

const update = async () =>{
  console.log(new Date().toLocaleString(),"update tribe_holders")
  await get_tribe_holders();
}

setInterval(update,1000*60*60*24)
setInterval(tick,1000*30)

