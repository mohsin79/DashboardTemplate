import DevTab, { ITabsOptions } from 'devextreme-react/tabs';



const Tabs = (option: RequiredField<ITabsOptions, 'dataSource' | 'width'>) => {
    return (
        <DevTab
            scrollByContent={true}
            showNavButtons={true}
            {...option}
        />
    )
}

export default Tabs;
