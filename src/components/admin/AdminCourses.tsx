import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import AdminCourseEditor from "./AdminCourseEditor";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  instructor: string;
  isActive: boolean;
}

const AdminCourses = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    duration: "",
    instructor: "",
    level: "Beginner",
    price: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/courses`);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/api/courses/${editingId}`, formData);
        if (response.data.success) {
          toast({ title: "Success", description: "Course updated successfully" });
          fetchCourses();
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/courses`, formData);
        if (response.data.success) {
          toast({ title: "Success", description: "Course created successfully" });
          fetchCourses();
        }
      }
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      setLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
      if (response.data.success) {
        toast({ title: "Success", description: "Course deleted successfully" });
        fetchCourses();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingId(course._id);
    setShowEditor(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      duration: "",
      instructor: "",
      level: "Beginner",
      price: 0
    });
  };

  return (
    <div className="space-y-6">
      {showEditor && editingId && (
        <AdminCourseEditor
          courseId={editingId}
          onClose={() => {
            setShowEditor(false);
            setEditingId(null);
          }}
          onSave={() => {
            fetchCourses();
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Course" : "Add New Course"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                placeholder="Slug (URL-friendly)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <RichTextEditor
              placeholder="Full Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              rows={3}
            />
            <Input
              placeholder="Short Description (Brief summary for course cards)"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              required
            />
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Duration (e.g., 3 months)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <Input
                placeholder="Instructor Name"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingId ? "Update Course" : "Add Course"}
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
          <CardTitle>Courses List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-muted-foreground">No courses found</p>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.instructor} • {course.duration}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(course._id)}
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
    </div>
  );
};

export default AdminCourses;
