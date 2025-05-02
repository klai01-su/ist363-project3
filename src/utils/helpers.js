// utils/helpers.js

export const getSummonerSpellName = (id) => {
    const spellMap = {
      1: "Boost",
      3: "Exhaust",
      4: "Flash",
      6: "Haste",
      7: "Heal",
      11: "Smite",
      12: "Teleport",
      13: "Mana",
      14: "Dot",
      21: "Barrier",
      32: "Snowball",
      2201: "CherryHold",
      2202: "CherryFlash"
    };
    return spellMap[id] || "Unknown";
  };
  
  export const getQueueDescription = (queueId) => {
    const queueMap = {
      400: "Blind Pick",
      420: "Ranked Solo",
      430: "Normal Draft",
      440: "Ranked Flex",
      450: "ARAM",
      1700: "Arena"
    };
    return queueMap[queueId] || "Unknown Queue";
  };
  
  export const getRuneImage = (runeId) => {
    const runeMap = {
      8000: "7201_Precision.png",
      8100: "7200_Domination.png",
      8200: "7202_Sorcery.png",
      8300: "7203_Whimsy.png",
      8400: "7204_Resolve.png",
  
      8005: "Precision/PressTheAttack/PressTheAttack.png",
      8008: "Precision/LethalTempo/LethalTempoTemp.png",
      8021: "Precision/FleetFootwork/FleetFootwork.png",
      8010: "Precision/Conqueror/Conqueror.png",
  
      8112: "Domination/Electrocute/Electrocute.png",
      8128: "Domination/DarkHarvest/DarkHarvest.png",
      9923: "Domination/HailOfBlades/HailOfBlades.png",
  
      8214: "Sorcery/SummonAery/SummonAery.png",
      8229: "Sorcery/ArcaneComet/ArcaneComet.png",
      8230: "Sorcery/PhaseRush/PhaseRush.png",
  
      8351: "Inspiration/GlacialAugment/GlacialAugment.png",
      8360: "Inspiration/UnsealedSpellbook/UnsealedSpellbook.png",
      8369: "Inspiration/FirstStrike/FirstStrike.png",
  
      8437: "Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
      8439: "Resolve/VeteranAftershock/VeteranAftershock.png",
      8465: "Resolve/Guardian/Guardian.png",
    };
  
    const baseURL =
      "https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/";
    return runeId && runeMap[runeId] ? `${baseURL}${runeMap[runeId]}` : "";
  };
  