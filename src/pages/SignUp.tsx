import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { validateForm, validationRules } from "@/utils/validation";
import { validatePassword } from "@/utils/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const { addUser } = useUser();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateFormData = () => {
    const validationErrors = validateForm(formData, {
      username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        custom: (value: string) => {
          if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Username can only contain letters, numbers, and underscores';
          }
          return null;
        }
      },
      email: validationRules.email,
      password: {
        required: true,
        custom: (value: string) => {
          const validation = validatePassword(value);
          if (!validation.isValid) {
            return validation.errors[0]; // Return first error
          }
          return null;
        }
      },
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value !== formData.password) {
            return 'Passwords do not match';
          }
          return null;
        }
      },
      firstName: validationRules.name,
      lastName: validationRules.name,
      phone: validationRules.phone,
      street: {
        required: true,
        minLength: 5,
        custom: (value: string) => {
          if (value.trim().length < 5) {
            return 'Please enter a valid street address';
          }
          return null;
        }
      },
      city: {
        required: true,
        minLength: 2,
        custom: (value: string) => {
          if (value.trim().length < 2) {
            return 'Please enter a valid city';
          }
          return null;
        }
      },
      state: {
        required: true,
        minLength: 2,
        custom: (value: string) => {
          if (value.trim().length < 2) {
            return 'Please enter a valid state';
          }
          return null;
        }
      },
      zipCode: {
        required: true,
        pattern: /^\d{5}(-\d{4})?$/,
        custom: (value: string) => {
          if (!/^\d{5}(-\d{4})?$/.test(value)) {
            return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
          }
          return null;
        }
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newUser = addUser({
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        isAdmin: false
      });

      toast({
        title: "Account Created Successfully!",
        description: `Welcome to Toto's Bureau, ${formData.firstName}!`,
      });

      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred while creating your account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50 shadow-strong">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-forest rounded-2xl flex items-center justify-center shadow-medium">
                <User className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
              <p className="text-muted-foreground">
                Join Toto's Bureau and start shopping for your furry friends!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'border-destructive' : ''}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'border-destructive' : ''}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'border-destructive' : ''}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'border-destructive' : ''}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Account Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Account Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={errors.username ? 'border-destructive' : ''}
                      placeholder="Choose a username"
                    />
                    {errors.username && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? 'border-destructive' : ''}
                        placeholder="Create a strong password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? 'border-destructive' : ''}
                        placeholder="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={errors.street ? 'border-destructive' : ''}
                      placeholder="Enter your street address"
                    />
                    {errors.street && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <XCircle className="h-4 w-4" />
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'border-destructive' : ''}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={errors.state ? 'border-destructive' : ''}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? 'border-destructive' : ''}
                        placeholder="12345"
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal to-forest hover:from-teal/90 hover:to-forest/90 text-white py-3 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
