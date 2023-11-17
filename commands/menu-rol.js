const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    name:"menu_rol",
    description: 'Sabit menü rol mesajını atar.',
    type:1,
    options: [
    {
      name: "roles",
      description: "Rol idlerini araya , koyarak yazınız.",
      type: 3,
      required: true
    },
    {
      name: "only_one_role",
      description: "Üye aşağıdaki menüden sadece bir rol mü alabilir?",
      type: 5,
      required: true
    }
  ],
  run: async(client, interaction) => {
    if(interaction.member.id != interaction.guild.ownerId) return interaction.reply({ ephemeral: 1, content: "Bu komutu sadece sunucu sahibi kullanabilir." });;
    let OnlyOneRole = interaction.options.getBoolean("only_one_role");
    let roles = [...new Set(interaction.options.getString("roles").split(",").map(id => id.trim()))].filter(id => interaction.guild.roles.cache.has(id));
		if(!roles.length) return interaction.reply({ ephemeral: 1, content: "Lütfen geçerli birkaç rol girin." });
    roles = roles.map(id => {
      let role = interaction.guild.roles.cache.get(id);
      return new StringSelectMenuOptionBuilder()
        .setLabel(role.name)
        .setValue(id)
    })

    let menu = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("role_menu")
          .setPlaceholder("Almak istediğiniz rolü seçin")
          .setMaxValues(OnlyOneRole ? 1 : roles.length)
          .addOptions(...roles)
      )

    interaction.channel.send({ embeds: [
      new EmbedBuilder()
        .setTitle("**Hey, Hoşgeldin! Burada istediğin rolü alabilirsin.**")
        .setDescription("Buradakı roller Bilgilendirme amaçlı kullanılır aşağıdakı menüden istediğin rolü seçebilirsin eğer rol aldıkdan sonra rolleri silmek istersen menüden tüm rolleri kaldırıp en aşağıdakı Rollerimi sil kısmını seçebilirsin bu sayede tüm aldığın roller silinicek.")
    ], components: [menu]
    });
    interaction.reply({ ephemeral: 1, content: "Rol menüsü kanala gönderildi." })
	},
};