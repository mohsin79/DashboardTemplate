import { FC, Suspense } from "react";
import Loader from "./Loader/Loader";

const DynamicComponent: FC<{ LazyComponent: React.LazyExoticComponent<() => JSX.Element> }> = ({ LazyComponent }) => {

    return (
        <Suspense fallback={<Loader loading={true} />}>
            <LazyComponent />
        </Suspense>
    );
}

export default DynamicComponent;