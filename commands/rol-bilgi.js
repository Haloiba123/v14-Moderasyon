const { EmbedBuilder } = require("discord.js");

module.exports = {
    name:"rol-bilgi",
    description: 'Bir roldeki kişiler hakkında bilgi verir',
    options: [
        {
            name: "rol",
            description: "Bilgisi gösterilecek rol",
            type: 8,
            required: true
        }
    ],
  run: async(client, interaction) => {
   if(interaction.user.id !== "843136836947410945") return interaction.reply("Bu komutu kullanmak için yetkin yok.");
        const role = interaction.options.getRole("rol");
        if (role.id == interaction.guild.id) return interaction.reply({ content: "Dostum bu rol zaten herkeste var!" });
        if (!role.members.size) return interaction.reply({ content: "Bu rolde gösterilecek üye yok!" });
        let i = 1
        const listEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Roldeki Üyeler")
            .setDescription(role.members.map(x => `**${i++}** | <@${x.id}> == ${x.id}`).join("\n").slice(0, 4000));
        return interaction.reply({ embeds: [listEmbed] })
    },
};