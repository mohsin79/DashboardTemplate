import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../../Styles/components/Loader.scss"


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    color: "green",
    position: "absolute",
    top: "50%",
    right: "50%",
    left: "50%",
    bottom: "50%"
};

interface loaderProps {
    loading: boolean,
}


function Loader ({ loading }: loaderProps) {
    return (
        <div className={loading ? 'parentDisable' : ''} style={{ width: "100%" }} >
                <div className='overlay-box'>
                    <ClipLoader
                        // css={override}
                        size={80}
                        color={"#4290ca"}
                        loading={loading}
                    />
                </div>
            </div>
    )
}

export default Loader;