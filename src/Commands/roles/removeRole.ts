import { MessageEmbed, Constants } from "discord.js";
import { Command } from "../../structures/Command";
import Role from "../../schemas/role-schema";

export default new Command({
    name: "removerole",
    description: "Remove a role for the server",
    options: [
        {
            name: "role",
            description: "The role that should be removed to the database",
            type: Constants.ApplicationCommandOptionTypes.ROLE,
            required: true
        }
    ],

    run: async ({ interaction }) => {

        const roleArray = [];

        const selectedRole = interaction.options.getRole("role").id;

        const roleIds = await Role.find({ serverId: interaction.guildId });
        console.log(roleIds);

        roleIds.forEach(obj => {
            roleArray.push(obj.roles);
        });

        const successEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Success ✅",
                value: "Removed Role from the database",
                inline: true,
            }
        ]);

        const errorEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Error ❌",
                value: "Role not found in the database",
                inline: true,
            }
        ]);

        if (!roleArray.some(i => i.roleId ===selectedRole)) {
            return interaction.followUp({ embeds: [errorEmbed]});
        } else {
            // Remove role from database
            await Role.deleteOne({ serverId: interaction.guildId, roleId: selectedRole });
            return interaction.followUp({ embeds: [successEmbed]});
        }
    }
});