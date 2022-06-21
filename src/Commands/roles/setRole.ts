import { MessageEmbed, Constants } from "discord.js";
import { Command } from "../../structures/Command";
import roleSchema from "../../schemas/role-schema";
import Role from "../../schemas/role-schema";

export default new Command({
    name: "setrole",
    description: "Set the roles for the server",
    options: [
        {
            name: "role",
            description: "The role that should be added to the database",
            type: Constants.ApplicationCommandOptionTypes.ROLE,
            required: true
        },
        {
            name: "color",
            description: "The color of the role button",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            choices: [{name: "Blurple", value: "1"}, {name: "Grey", value: "2"}, {name: "Green", value: "3"}, {name: "Red", value: "4"}],
            required: false
        }
    ],

    run: async ({ interaction }) => {

        const successEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Success ✅",
                value: "Added role to the database",
                inline: true,
            }
        ]);

        const errorEmbed = new MessageEmbed()
        .setColor("#635291")
        .setTimestamp()
        .addFields([
            {
                name: "Error ❌",
                value: "Role is already present in the database",
                inline: true,
            }
        ]);

        const roleArr = [];

        const roles = await Role.find({ serverId: interaction.guildId });

        roles.forEach(obj => {
            roleArr.push(obj.roles);
        });

        if (roleArr.some(i => i.roleId === interaction.options.getRole("role").id)) {
            return interaction.followUp({ embeds: [errorEmbed] });
        } else {
        var color: string;

        const selectedRole = interaction.options.getRole("role").id;
        if (!interaction.options.getString("color")) {
            color = "2";
        } else {
            color = interaction.options.getString("color");
        }

        await new roleSchema({
            serverId: interaction.guildId,
            roles: {
                roleId: selectedRole,
                btnColor: color
            }
        }).save();

        interaction.followUp({ embeds: [successEmbed] });
        }
    }
});