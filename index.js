const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const db = require("croxydb")
const config = require("./config.json")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { token } = require("./config.json");
readdirSync('./commands').forEach(f => {
  if (!f.endsWith(".js")) return;

  const props = require(`./commands/${f}`);

  client.commands.push({
      name: props.name.toLowerCase(),
      description: props.description,
      options: props.options,
      dm_permission: props.dm_permission,
      type: 1
  });

  console.log(`[KOMUT] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });
console.log(`[EVENT] ${name} eventi yüklendi.`)
});

client.on("guildMemberAdd", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `<a:giris:1124010403169587261> | ${member} sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})

client.on("messageCreate", async message => {
  const db = require("croxydb");

  if (await db.get(`afk_${message.author.id}`)) {
   
    db.delete(`afk_${message.author.id}`);

    message.reply("Afk Modundan Başarıyla Çıkış Yaptın!");
  }

  var kullanıcı = message.mentions.users.first();
  if (!kullanıcı) return;
  var sebep = await db.get(`afk_${kullanıcı.id}`);

  if (sebep) {
    message.reply("Etiketlediğin Kullanıcı **"+sebep+"** Sebebiyle Afk!");
  }
});

client.on("guildMemberRemove", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `<a:ayrildi:1124010398732001472> | ${member} sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})

client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let kufur = db.fetch(`kufurengel_${message.guild.id}`)
  if(!kufur) return;
  
  if(kufur) {
  const kufurler = [
    
    "amk",
    "piç",
    "yarrak",
    "oç",
    "göt",
    "amq",
    "yavşak",
    "amcık",
    "amcı",
    "orospu",
    "sikim",
    "sikeyim",
    "aq",
    "mk"
       
  ]
  
if(kufurler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Hey <@${message.author.id}>, Bu Sunucuda Küfür Engel Sistemi Aktif! `)
}
}
})
client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`)
  if(!reklamlar) return;
  
  if(reklamlar) {

  const linkler = [
    
    ".com.tr",
    ".net",
    ".org",
    ".tk",
    ".cf",
    ".gf",
    "https://",
    ".gq",
    "http://",
    ".com",
    ".gg",
    ".porn",
    ".edu"
       
  ]
  
if(linkler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Lann <@${message.author.id}>, Bu Sunucuda Reklam Engel Sistemi Aktif! `)
}
}
})

client.on("messageCreate", (message) => {
  
  let saas = db.fetch(`saas_${message.guild.id}`)
  if(!saas) return;
  
  if(saas) {
  
  let selaamlar = message.content.toLowerCase()  
if(selaamlar === 'sa' || selaamlar === 'slm' || selaamlar === 'sea' || selaamlar === ' selamünaleyküm' || selaamlar === 'Selamün Aleyküm' || selaamlar === 'selam'){

message.channel.send(`<@${message.author.id}> Aleykümselam, Hoşgeldin Canım ☺️`)
}
}
})

const { joinVoiceChannel } = require('@discordjs/voice')
client.on('ready', () => {
  let channel = client.channels.cache.get("1116414832216907926")
 

      const VoiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator
  });
})


client.on('ready', () => {
  console.log(`Giriş Başarılı ${client.user.tag}!`);
});
//////////////////////////////////////////////////////////////////////////

client.on("interactionCreate", async interaction => {
  if(interaction.customId != "role_menu") return;
  let roleIds = interaction.values;
  let message = await interaction.guild.channels.cache.get(interaction.channelId).messages.fetch(interaction.message.id);
  let data = message.components[0].components[0].data;
  if(data.max_values == 1) data.options.map(option => option.value).filter(roleId => interaction.member.roles.cache.has(roleId)).forEach(roleId => interaction.member.roles.remove(roleId).catch(e => {}));
  roleIds.forEach(roleId => interaction.member.roles.add(roleId).catch(e => {}));
  interaction.reply({ ephemeral: 1, content: `Başarıyla <@&${roleIds.join(">, <@&")}> rollerini aldın.` });
});

///////////////////////////////////////////////////////////////////////////
client.on('interactionCreate',async (interaction) => {


  if(interaction.customId === "captcha") {

  interaction.member.roles.add("1081615478579007559").catch(e => {})
 interaction.reply({content: "Rolün başarıyla verildi", ephemeral: true})

  
  }

  if(interaction.customId === "captcha2") {
  
    const channelid = client.channels.cache.get(config.channelid)
    if(!channelid) return;

const embed = new EmbedBuilder()
.setAuthor({name: "Hatalı Kod Girişi!", iconURL: interaction.user.avatarURL()})
.setDescription(`${interaction.user.tag} Adlı kullanıcı yanlış kod kullandı ve sunucudan atıldı.`)
.setFooter({text: "Wraiths Dev Tarafından Kodlanmıştır"})
.setColor("Red")

    channelid.send({embeds: [embed]})

    interaction.member.kick().catch(e => {})
    
    }

    if(interaction.customId === "captcha3") {
  
      const channelid = client.channels.cache.get(config.channelid)
      if(!channelid) return;
  
  const embed = new EmbedBuilder()
  .setAuthor({name: "Hatalı Kod Girişi!", iconURL: interaction.user.avatarURL()})
  .setDescription(`${interaction.user.tag} Adlı kullanıcı yanlış kod kullandı ve sunucudan atıldı.`)
  .setFooter({text: "Wraiths Dev Tarafından Kodlanmıştır"})
  .setColor("Red")
  
      channelid.send({embeds: [embed]})
  
      interaction.member.kick().catch(e => {})
      
      }
      if(interaction.customId === "captcha4") {
  
        const channelid = client.channels.cache.get(config.channelid)
        if(!channelid) return;
    
    const embed = new EmbedBuilder()
    .setAuthor({name: "Hatalı Kod Girişi!", iconURL: interaction.user.avatarURL()})
    .setDescription(`${interaction.user.tag} Adlı kullanıcı yanlış kod kullandı ve sunucudan atıldı.`)
    .setFooter({text: "Wraiths Dev Tarafından Kodlanmıştır"})
    .setColor("Red")
    
        channelid.send({embeds: [embed]})
    
        interaction.member.kick().catch(e => {})
        
        }


  })
///////////////////////////////////////////////////////////////////////////////////////
const db4 = require("quick.db")
client.on("guildMemberAdd", (member) => {
  if(!db4.has(`otorol_${member.guild.id}`)) return;
  if(!client.guilds.cache.get(member.guild.id).roles.cache.get(db4.get(`otorol_${member.guild.id}`))) return;
    member.roles.add(db4.get(`otorol_${member.guild.id}`))
})

///BOTUN ALTYAPISI TAMAMEN WRAİTHS TARAFINDAN HAZIRLANMIŞTIR.
//İZİNSİZ PAYLAŞILMASI VEYA KULLANILMASI YASAKTIR.
client.login(token)