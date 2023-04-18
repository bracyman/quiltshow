
import QuiltSelector from "./QuiltSelector";
import "../../styles/hangingTool.css"
import WallHanging from "./WallHanging";


const testQuilts = Array.from(Array(50).keys()).map(i => { return {id: i, name: `Quilt #${i}`, width: 40 + i, length: 40 + i }});


const QuiltHangingTool = (props) => {

    const wall = { name: "LRC14", hangingLocations: [], width: 10, length: 10 };

    return (<>
        <WallHanging wall={wall} />
        <QuiltSelector quilts={testQuilts} />
    </>);
};

export default QuiltHangingTool;