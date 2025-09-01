import { getServerIp } from "@/app/util/ipAddrs";

export async function GET(){
    return new Response(getServerIp());
}