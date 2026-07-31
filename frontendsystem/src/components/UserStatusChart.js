import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const COLORS = [

    "#2ecc71",

    "#e74c3c"

];

function UserStatusChart({ data }) {

    console.log(data);

return (

    <div className="chart-card">
      
        <h3>User Status</h3>
        <ResponsiveContainer
            width="100%"
            height="100%"
        >

           <PieChart>

    <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
    >

        {data.map((entry, index) => (

            <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
            />

        ))}

    </Pie>

    <Tooltip />

    <Legend />

</PieChart>

        </ResponsiveContainer>

    </div>

);


}

export default UserStatusChart;