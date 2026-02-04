import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { Plus, Edit2, Trash2, Loader2, BarChart3, Users } from "lucide-react";
import ImageUpload from "../ImageUpload";

interface Placement {
  _id: string;
  studentName: string;
  company: string;
  position: string;
  course: string;
}

interface PlacementStats {
  _id?: string;
  totalPlacements: string;
  averageSalary: string;
  topCompanies: string;
  placementRate: string;
  highestSalary: string;
  companiesPartnered: string;
}

const AdminPlacements = () => {
  const { toast } = useToast();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    course: "",
    company: "",
    position: ""
  });
  const [placementStats, setPlacementStats] = useState<PlacementStats>({
    totalPlacements: "",
    averageSalary: "",
    topCompanies: "",
    placementRate: "",
    highestSalary: "",
    companiesPartnered: ""
  });

  useEffect(() => {
    fetchPlacements();
    fetchPlacementStats();
  }, []);

  const fetchPlacements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/placements`);
      if (response.data.success) {
        setPlacements(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch placements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacementStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/placement-stats`);
      if (response.data.success && response.data.data) {
        setPlacementStats(response.data.data);
      }
    } catch (error: any) {
      // Stats might not exist yet, that's okay
      console.log("Placement stats not found, using defaults");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSaveStats = async () => {
    try {
      setStatsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/placement-stats`, placementStats);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Placement statistics updated successfully"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update placement statistics",
        variant: "destructive"
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/placements/${editingId}`, formData);
        if (response.data.success) {
          toast({ title: "Success", description: "Placement updated successfully" });
          fetchPlacements();
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/placements`, formData);
        if (response.data.success) {
          toast({ title: "Success", description: "Placement created successfully" });
          fetchPlacements();
        }
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save placement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this placement?")) return;
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/api/placements/${id}`);
      if (response.data.success) {
        toast({ title: "Success", description: "Placement deleted successfully" });
        fetchPlacements();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete placement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (placement: Placement) => {
    setEditingId(placement._id);
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/placements/${placement._id}`);
      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          studentName: data.studentName || "",
          course: data.course || "",
          company: data.company || "",
          position: data.position || ""
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch placement data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      studentName: "",
      course: "",
      company: "",
      position: ""
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="placements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="placements" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Manage Placements
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Placement Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="placements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Edit Placement" : "Add New Placement"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Student Name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Course"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Position/Role"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    {editingId ? "Update Placement" : "Add Placement"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Placements List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : placements.length === 0 ? (
                <p className="text-muted-foreground">No placements found</p>
              ) : (
                <div className="space-y-2">
                  {placements.map((placement) => (
                    <div key={placement._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{placement.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{placement.company} • {placement.position}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(placement)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(placement._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Placement Statistics</CardTitle>
                    <p className="text-muted-foreground text-sm">Manage placement stats displayed on the website</p>
                  </div>
                </div>
                <Button onClick={handleSaveStats} disabled={statsLoading} className="bg-gradient-primary hover-glow">
                  {statsLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Statistics
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalPlacements">Total Placements</Label>
                  <Input
                    id="totalPlacements"
                    value={placementStats.totalPlacements}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, totalPlacements: e.target.value }))}
                    placeholder="e.g., 500+"
                  />
                </div>
                <div>
                  <Label htmlFor="placementRate">Placement Rate</Label>
                  <Input
                    id="placementRate"
                    value={placementStats.placementRate}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, placementRate: e.target.value }))}
                    placeholder="e.g., 95%"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="averageSalary">Average Salary</Label>
                  <Input
                    id="averageSalary"
                    value={placementStats.averageSalary}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, averageSalary: e.target.value }))}
                    placeholder="e.g., ₹6.5 LPA"
                  />
                </div>
                <div>
                  <Label htmlFor="highestSalary">Highest Salary</Label>
                  <Input
                    id="highestSalary"
                    value={placementStats.highestSalary}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, highestSalary: e.target.value }))}
                    placeholder="e.g., ₹25 LPA"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companiesPartnered">Companies Partnered</Label>
                  <Input
                    id="companiesPartnered"
                    value={placementStats.companiesPartnered}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, companiesPartnered: e.target.value }))}
                    placeholder="e.g., 100+"
                  />
                </div>
                <div>
                  <Label htmlFor="topCompanies">Top Companies</Label>
                  <Input
                    id="topCompanies"
                    value={placementStats.topCompanies}
                    onChange={(e) => setPlacementStats(prev => ({ ...prev, topCompanies: e.target.value }))}
                    placeholder="e.g., Google, Microsoft, Amazon"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{placementStats.totalPlacements || "0"}</div>
                    <div className="text-muted-foreground">Total Placements</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{placementStats.placementRate || "0%"}</div>
                    <div className="text-muted-foreground">Placement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{placementStats.averageSalary || "₹0"}</div>
                    <div className="text-muted-foreground">Average Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{placementStats.highestSalary || "₹0"}</div>
                    <div className="text-muted-foreground">Highest Salary</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary">{placementStats.companiesPartnered || "0"}</div>
                    <div className="text-muted-foreground">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-primary truncate">{placementStats.topCompanies || "None"}</div>
                    <div className="text-muted-foreground">Top Companies</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPlacements;
