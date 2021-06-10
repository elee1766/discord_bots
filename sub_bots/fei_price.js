import { uniV2Price, reweight_time } from "../shared/eth_query.js";
import {db} from "../shared/db.js";
import Discord from "discord.js";

const client = new Discord.Client();

client.on('ready',()=>{
  console.log(`${client.user.tag} now online`)
})


const get_fei_price = async ()=>{
  return uniV2Price("0x94b0a3d511b6ecdb17ebf877278ab030acb0a878",18,18,true).then((fei)=>{
    uniV2Price("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",6,18,true).then((eth)=>{
      const price = eth.div(fei).toNumber()
      db.put('last_fei_price',price);
    })
  });
}
const get_reweight_time = async ()=>{
  return reweight_time().then((time)=>{
      db.put('last_reweight_time',time);
  });
}

export const start_fei_price = async (token) => {
  client.login(token).then(async ()=>{
    await update();
    await tick();
  })
}

const tick = async () =>{
  db.get('last_fei_price').then((price)=>{
    client.guilds.cache.array().forEach((guild)=>{
      guild.me.setNickname(`! $${Math.floor(price*10000)/10000}`)
    })
  }).catch(()=>{});

  db.get('last_reweight_time').then((time)=>{
    client.user.setActivity(`reweight in: ${time}`)
  })
}

const update = async () =>{
  console.log(new Date().toLocaleString(),"update fei_price")
  await get_fei_price();
  await get_reweight_time();
}

setInterval(update,1000*60*5)
setInterval(tick,1000*30)

