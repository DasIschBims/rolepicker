import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "roles",
    description: "Sends an embed to get roles",

    run: async ({ interaction }) => {
        const roleIds = [
            // grab 5 role ids from the database and put them here
            // => later have to create another row for every 5 roles

            // just some random roles to test with
            "988532629806665740",
            "988532611569844235"
        ];
        
        const embed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Roles",
                value: "Click the buttons below to obtain roles",
                inline: true,
            }
        ]);

        const row = new MessageActionRow();

        roleIds.forEach(role => {
            row.addComponents(
                new MessageButton()
                .setCustomId(role)
                .setLabel(interaction.guild.roles.cache.get(role).name)
                .setStyle("PRIMARY")
            );
        });

        interaction.followUp({ embeds: [embed], components: [row]})
    }
});