import { Hamburger } from "@/components/hamburger/hamburger";
import {
    operatingSystem,
    database,
    network,
    ai,
    linux,
    git,
    algorithm,
    computerStructure,
    dev,
    flutter
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
        </Layout>
    );
}