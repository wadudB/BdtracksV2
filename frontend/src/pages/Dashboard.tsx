import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  // Mock data - would come from API in real app
  const topCommodities = [
    { id: "1", name: "Rice (Fine)", price: 80, unit: "kg", change: 2.5 },
    { id: "2", name: "Rice (Medium)", price: 60, unit: "kg", change: 1.2 },
    { id: "3", name: "Wheat", price: 45, unit: "kg", change: -0.5 },
    { id: "4", name: "Onion", price: 120, unit: "kg", change: 15 },
    { id: "5", name: "Potato", price: 35, unit: "kg", change: -2 },
    { id: "6", name: "Soybean Oil", price: 180, unit: "liter", change: 0 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <select className="bg-background border border-border rounded-md p-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
              Update
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Rice</h3>
              <span className="material-icons text-chart-1">agriculture</span>
            </div>
            <p className="text-3xl font-bold">
              ৳80 <span className="text-sm font-normal">per kg</span>
            </p>
            <div className="flex items-center mt-2">
              <span className="material-icons text-red-500 text-sm">arrow_upward</span>
              <span className="text-red-500 text-sm">2.5% from last week</span>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Wheat</h3>
              <span className="material-icons text-chart-3">agriculture</span>
            </div>
            <p className="text-3xl font-bold">
              ৳45 <span className="text-sm font-normal">per kg</span>
            </p>
            <div className="flex items-center mt-2">
              <span className="material-icons text-green-500 text-sm">arrow_downward</span>
              <span className="text-green-500 text-sm">0.5% from last week</span>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Onion</h3>
              <span className="material-icons text-chart-5">agriculture</span>
            </div>
            <p className="text-3xl font-bold">
              ৳120 <span className="text-sm font-normal">per kg</span>
            </p>
            <div className="flex items-center mt-2">
              <span className="material-icons text-red-500 text-sm">arrow_upward</span>
              <span className="text-red-500 text-sm">15% from last week</span>
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Soybean Oil</h3>
              <span className="material-icons text-chart-2">oil_barrel</span>
            </div>
            <p className="text-3xl font-bold">
              ৳180 <span className="text-sm font-normal">per liter</span>
            </p>
            <div className="flex items-center mt-2">
              <span className="material-icons text-yellow-500 text-sm">remove</span>
              <span className="text-yellow-500 text-sm">No change from last week</span>
            </div>
          </div>
        </div>

        {/* Price Trends Chart - Placeholder */}
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4">Price Trends</h2>
          <div className="h-80 w-full bg-muted/30 flex items-center justify-center">
            <p className="text-muted-foreground">Price trend chart will be displayed here</p>
          </div>
        </div>

        {/* Top Commodities */}
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4">Top Commodities</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Commodity</th>
                  <th className="text-right py-3 px-4">Price</th>
                  <th className="text-right py-3 px-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {topCommodities.map((commodity) => (
                  <tr key={commodity.id} className="border-b border-border hover:bg-muted/30">
                    <td className="py-3 px-4">{commodity.name}</td>
                    <td className="text-right py-3 px-4">
                      ৳{commodity.price}/{commodity.unit}
                    </td>
                    <td className="text-right py-3 px-4">
                      <span
                        className={
                          commodity.change > 0
                            ? "text-red-500"
                            : commodity.change < 0
                              ? "text-green-500"
                              : "text-yellow-500"
                        }
                      >
                        {commodity.change > 0 && "+"}
                        {commodity.change}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional Price Map - Placeholder */}
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4">Regional Prices</h2>
          <div className="h-80 w-full bg-muted/30 flex items-center justify-center">
            <p className="text-muted-foreground">Google Maps integration will be displayed here</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
