import { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction, Permissions } from "discord.js";
import { Command } from "../../structures/Command";
import Role from "../../schemas/role-schema";
import { client } from "../..";

export default new Command({
    name: "roles",
    description: "Sends an embed to get roles",

    run: async ({ interaction }) => {
        if (!interaction.guild.members.cache.get(client.user.id).permissions.has(Permissions.FLAGS.MANAGE_ROLES) || !interaction.guild.members.cache.get(client.user.id).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.followUp({ embeds: [
                new MessageEmbed()
                .setColor("#635291")
                .setTimestamp()
                .addFields([
                    {
                        name: "Error ❌",
                        value: "I don't have the `MANAGE_ROLES` permission",
                        inline: true,
                    }
                ]),
            ]});
        }

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
            if (!interaction.guild.roles.cache.get(role.roleId)) {
                const missingRole = role.roleId;
                await Role.deleteOne({ serverId: interaction.guildId, roleId: missingRole });
                console.log("Deleted role from database");
                return;
            }
            
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
            setTimeout(() => {
                interaction.followUp({ embeds: [successEmbed], components: [row] });
            }, 1000);
        };

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (component) => component.type === "MESSAGE_COMPONENT",
            max: 10,
            time: 1000 * 60 * 0.5,
        });

        collector.on("collect", async (i: ButtonInteraction) => {

                const role = i.guild.roles.cache.get(i.customId);
                i.guild.members.cache.get(i.user.id).roles.add(role);

                await i.reply({ embeds: [
                    new MessageEmbed()
                    .setColor("#635291")
                    .setTimestamp()
                    .addFields([
                        {
                            name: "Obtained role ✅",
                            value: `You now have the ${i.guild.roles.cache.get(i.customId)} role`,
                            inline: true,
                        }
                    ]),
                ], ephemeral: true, fetchReply: true });
        });

        collector.on("end", async () => {
            await interaction.editReply({ embeds: [
                new MessageEmbed()
                .setColor("#635291")
                .setDescription("Command expired! ❌\n\nYou can try running the command again"),
            ], components: [] });
        });
    }
});