import { GetServerIp } from "@/app/util/ipAddrs";

export async function GET(){
    return new Response(GetServerIp());
}