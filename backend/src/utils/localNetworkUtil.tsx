import { networkInterfaces } from "os";

export const isNetworkAccessEnabled = process.env.NETWORK_ACCESS === 'true';

// Function to get local IP addresses
function getLocalIPs() {
    const nets = networkInterfaces();
    const results = [];

    for (const name of Object.keys(nets)) {
        const interfaces = nets[name];
        if (interfaces) {
            for (const net of interfaces) {
                // Skip internal and non-IPv4 addresses
                if (net.family === 'IPv4' && !net.internal) {
                    results.push(net.address);
                }
            }
        }
    }
    return results;
}

export function printExternalNetworkIPs(port: number) {
    const networkIPs = getLocalIPs();
    if (networkIPs.length > 0) {
        console.log('\nAccessiable to other devices on Local Network at:');
        networkIPs.forEach(ip => {
            console.log(`http://${ip}:${port}`);
        });
    }
}