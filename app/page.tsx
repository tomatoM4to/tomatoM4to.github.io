import { Hamburger } from "@/components/hamburger/hamburger";
import {
    ai,
    algorithm,
    backend,
    database,
    docker,
    flutter,
    network,
    operatingSystem
} from "@/components/theme/data";
import { Layout, Theme } from "@/components/theme/main";

export default async function Home() {
    return (
        <Layout>
            <Hamburger />
            <Theme theme={operatingSystem} />
            <Theme theme={database} />
            <Theme theme={network} />
            <Theme theme={ai} />
            {/* <Theme theme={linux} /> */}
            {/* <Theme theme={git} /> */}
            <Theme theme={algorithm} />
            {/* <Theme theme={computerStructure} /> */}
            {/* <Theme theme={dev} /> */}
            <Theme theme={flutter} />
            <Theme theme={backend} />
            <Theme theme={docker} />
        </Layout>
    );
}