// import { Button } from "@/components/button";
// import { VscCode } from "react-icons/vsc";
// import { VscSourceControl } from "react-icons/vsc";
// import { VscSparkle } from "react-icons/vsc";
// import { VscTerminalLinux } from "react-icons/vsc";
// import { VscGithubInverted } from "react-icons/vsc";
// import { MiniTitle } from "@/components/miniTitle";
// import { sidebar } from "@/components/responsiveConfig";


// export function Sidebar() {
//     return (
//         <aside className={`${sidebar} p-7 fixed`}>
//             <MiniTitle title="메인메뉴" />
//             <div className="flex flex-col border-b-2 border-gray-300">
//                 <Button href="/" icon={<VscSparkle />} title="소개" count={-1} />
//                 <Button href="/" icon={<VscSourceControl />} title="컴퓨터 과학" count={0} />
//                 <Button href="/" icon={<VscCode />} title="데브" count={0} />
//                 <Button href="/" icon={<VscTerminalLinux />} title="리눅스/도커" count={0} />
//                 <Button href="https://github.com/tomatoM4to" icon={<VscGithubInverted />} title="깃헙" count={0} />
//             </div>
//         </aside>
//     )
// }