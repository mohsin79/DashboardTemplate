import ApplicationGird from "../../ApplicationGrid";

const Rejected = () => {

    return (
        <>
            <h4 style={{ padding: 5 }}>Rejected Applications</h4>
            <ApplicationGird statusType={4} />
        </>
    )
}

export default Rejected