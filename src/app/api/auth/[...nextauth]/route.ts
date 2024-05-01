import NextAuth from "next-auth";
import { config } from "@/utils/auth";

const handlers = NextAuth(config);

export { handlers as GET, handlers as POST };
