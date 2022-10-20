import ApplicationGird from "../../ApplicationGrid";

const Pending = () => {

    return (
        <>
            <h4 style={{ padding: 5 }}>Pending Applications</h4>
            <ApplicationGird statusType={2} />
        </>
    )
}

export default Pending