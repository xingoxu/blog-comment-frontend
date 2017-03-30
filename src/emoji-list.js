let textEmoji = [{ value: `(⌒▽⌒)` }
  , { value: `（￣▽￣）` }
  , { value: `(= ・ω・ =)` }
  , { value: `(｀・ω・ ´)` }
  , { value: `(〜￣△￣)〜` }
  , { value: `(･∀･)` }
  , { value: `(°∀°)ﾉ` }
  , { value: `(￣3￣)` }
  , { value: `╮(￣▽￣)╭` }
  , { value: `(´_ゝ｀)` }
  , { value: `("▔□▔)/` }
  , { value: `(ﾟДﾟ≡ﾟдﾟ)` }
  , { value: `!?Σ(ﾟдﾟ;)` }
  , { value: `Σ(￣□￣||)` }
  , { value: `(´；ω；\`)` }
  , { value: `（/TДT)/` }
  , { value: `(｡･ω･｡)` }
  , { value: `(ノ≧∇≦) ノ ` }
  , { value: `(´･_･\`)` }
  , { value: `(-_ -#)` }
  , { value: `（￣へ￣）` }
  , { value: `(￣ε(#￣) Σ` }
  , { value: `ヽ (\`Д´)ﾉ` }
  , { value: `(╯° 口 °) ╯(┴—┴` }
  , { value: `_(:3」∠)_` }
  , { value: `┌(ಠ_ಠ) ┘` }
  , { value: `٩͡[๏̯͡๏]۶` }
  , { value: `٩(×̯×)۶` }
  , { value: `´_ゝ｀` }
  , { value: `（｀へ ´）` }
  , { value: `🙄` }
  , { value: `🙃` }
  , { value: `😀` }
  , { value: `😏` }
  , { value: `😉` }
  , { value: `🤗` }
  , { value: `👻` }
  , { value: `🤕` }
  , { value: `🤒` }
  , { value: `😎` }
  , { value: `🤓` }
  , { value: `💩` }
  , { value: `😤` }
  , { value: `🍵` }
  , { value: `💊` }
  , { value: `🐸` }
  , { value: `🐶` }
  , { value: `🐑` }
  , { value: `🌝` }
  , { value: `✨` }
  , { value: `💦` }
  , { value: `🍭` }
  , { value: `🎲` }];

textEmoji.forEach(emoji => { emoji.text = emoji.value });

let weiboEmoji = [
  { url: "08/dorahaose_org.gif" },
  { url: "c7/dorahaipa_org.gif" },
  { url: "f0/dorachijing_org.gif" },
  { url: "61/dorahan_org.gif" },
  { url: "34/xiaoku_org.gif" },
  { url: "09/pcmoren_tanshou_org.png" },
  { url: "74/moren_hashiqi_org.png" },
  { url: "b6/doge_org.gif" },
  { url: "4a/mm_org.gif" },
  { url: "9e/jqmweixiao_org.gif" },
  { url: "89/hufen_org.gif" },
  { url: "ac/smilea_org.gif" },
  { url: "0b/tootha_org.gif" },
  { url: "6a/laugh.gif" },
  { url: "14/tza_org.gif" },
  { url: "af/kl_org.gif" },
  { url: "a0/kbsa_org.gif" },
  { url: "f4/cj_org.gif" },
  { url: "6e/shamea_org.gif" },
  { url: "c3/zy_org.gif" },
  { url: "29/bz_org.gif" },
  { url: "71/bs2_org.gif" },
  { url: "6d/lovea_org.gif" },
  { url: "9d/sada_org.gif" },
  { url: "19/heia_org.gif" },
  { url: "8f/qq_org.gif" },
  { url: "b6/sb_org.gif" },
  { url: "58/mb_org.gif" },
  { url: "17/ldln_org.gif" },
  { url: "98/yhh_org.gif" },
  { url: "6d/zhh_org.gif" },
  { url: "a6/x_org.gif" },
  { url: "af/cry.gif" },
  { url: "73/wq_org.gif" },
  { url: "9e/t_org.gif" },
  { url: "f3/k_org.gif" },
  { url: "27/bba_org.gif" },
  { url: "7c/angrya_org.gif" },
  { url: "5c/yw_org.gif" },
  { url: "a5/cza_org.gif" },
  { url: "70/88_org.gif" },
  { url: "e9/sk_org.gif" },
  { url: "24/sweata_org.gif" },
  { url: "7f/sleepya_org.gif" },
  { url: "6b/sleepa_org.gif" },
  { url: "90/money_org.gif" },
  { url: "0c/sw_org.gif" },
  { url: "40/cool_org.gif" },
  { url: "8c/hsa_org.gif" },
  { url: "49/hatea_org.gif" },
  { url: "36/gza_org.gif" },
  { url: "d9/dizzya_org.gif" },
  { url: "1a/bs_org.gif" },
  { url: "62/crazya_org.gif" },
  { url: "91/h_org.gif" },
  { url: "6d/yx_org.gif" },
  { url: "89/nm_org.gif" },
  { url: "40/hearta_org.gif" },
  { url: "ea/unheart.gif" },
  { url: "58/pig.gif" },
  { url: "d6/ok_org.gif" },
  { url: "d9/ye_org.gif" },
  { url: "d8/good_org.gif" },
  { url: "c7/no_org.gif" },
  { url: "d0/z2_org.gif" },
  { url: "40/come_org.gif" },
  { url: "d8/sad_org.gif" },
  { url: "91/lazu_org.gif" },
  { url: "c4/liwu_org.gif" },  
];

let weiboURLBase = 'https://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/';

weiboEmoji.forEach(emoji => {
  emoji.url = weiboURLBase + emoji.url;
  emoji.value = `![](${emoji.url})`;
});

export default [
  {
    name: '微博',
    emojis: weiboEmoji,
  },
  {
    name: '颜文字',
    emojis: textEmoji,
  }
];