import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Phone, MapPin, ArrowLeft, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, updateUser, deleteUser, logoutUser } = useUser();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // Update profile data when current user changes
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address.street,
        city: currentUser.address.city,
        state: currentUser.address.state,
        zip: currentUser.address.zipCode
      });
    }
  }, [currentUser]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    try {
      await updateUser(currentUser.id, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAddress = async () => {
    if (!currentUser) return;
    
    try {
      await updateUser(currentUser.id, {
        address: {
          street: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zipCode: profileData.zip,
          country: "United States" // Default country
        }
      });
      
      toast({
        title: "Address Updated",
        description: "Your shipping address has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update address. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    try {
      await deleteUser(currentUser.id);
      logoutUser();
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, rgba(253, 159, 72, 0.1), rgba(253, 159, 72, 0.2))' }}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    autoComplete="family-name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="pl-10"
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <div className="flex">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="address" 
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="pl-10"
                      autoComplete="street-address"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    autoComplete="address-level2"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state"
                    value={profileData.state}
                    onChange={handleProfileChange}
                    autoComplete="address-level1"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input 
                    id="zip" 
                    name="zip"
                    value={profileData.zip}
                    onChange={handleProfileChange}
                    autoComplete="postal-code"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateAddress}>Update Address</Button>
            </CardContent>
          </Card>

          {/* Delete Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Once you delete your account, there is no going back. Please be certain.
                </AlertDescription>
              </Alert>

              {!showDeleteConfirm ? (
                <Button 
                  variant="outline" 
                  className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium">Are you absolutely sure? This action cannot be undone.</p>
                  <div className="flex gap-4">
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete My Account
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSettings;

