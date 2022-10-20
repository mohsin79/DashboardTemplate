import ApplicationGird from "../../ApplicationGrid";

const Accepted = () => {

    return (
        <>
            <h4 style={{ padding: 5 }}>Accepted Applications</h4>
            <ApplicationGird statusType={3} />
        </>
    )
}

export default Accepted