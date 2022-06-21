import mongoose from "mongoose";

const schema = new mongoose.Schema({
    serverId: { type: String, required: false },
    roles: {
        roleId: { type: String, required: false },
        btnColor: { type: String, required: false }
    }
});

export default mongoose.model("sever-roles", schema, "server-roles");