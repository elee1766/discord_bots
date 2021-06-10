import {ethers} from "ethers";
import BigNumber from "bignumber.js";
import V2Pool from "../abis/UniswapV2Pair.js";
import PcvController from "../abis/PcvController.js";
import moment from "moment";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const ten = new BigNumber(10)

export const uniV2Price = async (poolAddress, decimal0, decimal1, token0Numerator) =>{
  const contract = new ethers.Contract(poolAddress,V2Pool,provider);
  const [price0,price1,ts] = (await contract.getReserves()).map((x)=>{return new BigNumber(x.toString())})
  let ratio;
  if(token0Numerator){
    ratio = price0.div(ten.pow(decimal0)).div(price1.div(ten.pow(decimal1)))
  }else{
    ratio = price1.div(ten.pow(decimal1)).div(price0.div(ten.pow(decimal0)));
  }
  return ratio
}


export const reweight_time = async() =>{
  const contract = new ethers.Contract("0x0760dfE09Bd6d04D0Df9a60C51f01ecedCEb5132",PcvController,provider);
  const seconds = (await contract.remainingTime()).toNumber();
  return moment.duration(seconds,'s').humanize()
}

export const pcv_amount = async() =>{
  const contract = new ethers.Contract("0x0760dfE09Bd6d04D0Df9a60C51f01ecedCEb5132",PcvController,provider);
  const wethbalance = new BigNumber((await contract.getReserves())[1].toString()).div(1e18);
  const ethbalance = new BigNumber((await provider.getBalance("0xDa079A280FC3e33Eb11A78708B369D5Ca2da54fE")).toString()).div(1e18);
  const ethbalance2 = new BigNumber((await provider.getBalance("0xa08A721dFB595753FFf335636674D76C455B275C")).toString()).div(1e18);
  return ethbalance.plus(wethbalance.plus(ethbalance2))
}

