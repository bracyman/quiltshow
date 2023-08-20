import { useState } from "react";

const LoadingButton = (props) => {
    const [loading, setLoading] = useState(false);

    const {id, method, className, disabled} = props;
    const loadingLabel = props.loadingLabel || "...";

    const execute = async () => {
        let btn = document.getElementById(id);
        btn.disabled = true;

        setLoading(true);
        await method();
        setLoading(false);

        btn.disabled = disabled || false;
    };

    return (
        <button id={id} className={className} onClick={execute} disabled={disabled || loading}>{loading ? loadingLabel : props.children}</button>
    );
};


export default LoadingButton;