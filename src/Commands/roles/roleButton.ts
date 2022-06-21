import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Command } from "../../structures/Command";
import Role from "../../schemas/role-schema";

export default new Command({
    name: "roles",
    description: "Sends an embed to get roles",

    run: async ({ interaction }) => {
        const roleArr = [];

        const roles = await Role.find({ serverId: interaction.guildId });

        roles.forEach(obj => {
            roleArr.push(obj.roles);
        });
        
        const successEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Roles 📃",
                value: "Click the buttons below to obtain roles",
                inline: true,
            }
        ]);

        const errorEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Error ❌",
                value: "No roles found in the database, start by adding some with `/setrole`",
                inline: true,
            }
        ]);

        const row = new MessageActionRow();

        roleArr.forEach(async role => {

            row.addComponents(
                new MessageButton()
                .setCustomId(role.roleId)
                .setLabel(interaction.guild.roles.cache.get(role.roleId).name)
                .setStyle(parseInt(role.btnColor))
            );
        });

        if (roleArr.length === 0) {
            interaction.followUp({ embeds: [errorEmbed] });
        } else {
            interaction.followUp({ embeds: [successEmbed], components: [row] });
        };
    }
});