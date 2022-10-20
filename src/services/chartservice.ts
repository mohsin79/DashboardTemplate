import { Chart } from 'chart.js'
export const colorGenerator = (internalDataLength:number) => {
    const graphColors = [];
    const graphOutlines = [];
    const hoverColor = [];

    // const internalDataLength = internalData.length;
    let i = 0;
    while (i <= internalDataLength) {
        const randomR = Math.floor((Math.random() * 256) + 100);
        const randomG = Math.floor((Math.random() * 256) + 100);
        const randomB = Math.floor((Math.random() * 256) + 100);

        const graphBackground = `rgb(${randomR} , ${randomG}, ${randomB})`;
        graphColors.push(graphBackground);

        const graphOutline = `rgb(${randomR - 80},${randomG - 80},${randomB - 80})`;
        graphOutlines.push(graphOutline);

        const hoverColors = `rgb(${randomR + 25},${randomG + 25},${randomB + 25})`;
        hoverColor.push(hoverColors);

        i++;
    }
    return {
        "bgColor": graphColors,
        "bdColor": graphOutlines,
        "hoverColor": hoverColor
    }
}
type ChartType = "pie" | 'bar' | 'doughnut'
function commonBars(chartObject: string, dataSetArray: Array<any>, type: ChartType = "bar") {
    let objectbar: any = {};
    const { bgColor, bdColor } = colorGenerator(dataSetArray.length);
    objectbar.label = chartObject;
    objectbar.data = dataSetArray;
    objectbar.backgroundColor = bgColor;
    objectbar.borderColor = bdColor;
    objectbar.borderWidth = type === "pie" ? 0 : 2;
    // objectbar.radius = 0,
    // objectbar.pointStyle = 'line';
    //objectbar.fill = false;
    //objectbar.borderDash = [5, 5];


    return objectbar;
}


export const createChart = (chartId: string, type: ChartType, parentLabel: string[], data: Array<any>, options?: object) => {
    if (typeof (chartId) !== 'string' &&
        typeof (type) !== 'string' &&
        typeof (parentLabel) !== 'string' &&
        !Array.isArray(data) &&
        typeof (options) !== 'object'
    ) return console.log("param type not valid");
    //@ts-ignore
    const getContext2d = document.getElementById(chartId).getContext('2d');
    return new Chart(getContext2d, {
        type: type,
        data: {
            labels: parentLabel,
            datasets: data.map(d => (commonBars(d.label, d.data, type)))
        },
        options: options,
    });
}