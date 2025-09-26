import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, User, GraduationCap, MapPin, Calendar, Eye, EyeOff, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    highSchoolName: '',
    highSchoolLocation: '',
    graduationYear: '',
    currentEducationLevel: '',
    fieldOfInterest: ''
  });

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.highSchoolName.trim()) {
        newErrors.highSchoolName = 'High school name is required';
      }

      if (!formData.highSchoolLocation.trim()) {
        newErrors.highSchoolLocation = 'High school location is required';
      }

      if (!formData.graduationYear) {
        newErrors.graduationYear = 'Graduation year is required';
      } else {
        const year = parseInt(formData.graduationYear);
        const currentYear = new Date().getFullYear();
        if (year < 1950 || year > currentYear + 10) {
          newErrors.graduationYear = 'Please enter a valid graduation year';
        }
      }

      if (!formData.currentEducationLevel) {
        newErrors.currentEducationLevel = 'Current education level is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        Alert.alert('Sign In Error', error.message);
        return;
      }

      Alert.alert('Success', 'Signed in successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            high_school_name: formData.highSchoolName,
            high_school_location: formData.highSchoolLocation,
            graduation_year: parseInt(formData.graduationYear),
            current_education_level: formData.currentEducationLevel,
            field_of_interest: formData.fieldOfInterest
          }
        }
      });

      if (error) {
        Alert.alert('Sign Up Error', error.message);
        return;
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            full_name: formData.fullName,
            education_level: formData.currentEducationLevel,
            field_of_study: formData.fieldOfInterest,
            graduation_year: parseInt(formData.graduationYear),
            interests: formData.fieldOfInterest ? [formData.fieldOfInterest] : []
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Create user settings
        const { error: settingsError } = await supabase
          .from('user_settings')
          .insert({
            user_id: data.user.id,
            theme: 'system',
            notifications_enabled: true,
            email_notifications: true,
            push_notifications: true,
            privacy_level: 'public',
            language: 'en',
            timezone: 'UTC'
          });

        if (settingsError) {
          console.error('Error creating settings:', settingsError);
        }
      }

      Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
      setIsSignUp(false);
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      highSchoolName: '',
      highSchoolLocation: '',
      graduationYear: '',
      currentEducationLevel: '',
      fieldOfInterest: ''
    });
    setErrors({});
    setTouched({});
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const educationLevels = [
    'High School Student',
    'High School Graduate',
    'University Student (1st Year)',
    'University Student (2nd Year)',
    'University Student (3rd Year)',
    'University Student (4th Year)',
    'University Graduate',
    'Postgraduate Student',
    'Working Professional'
  ];

  const fieldsOfInterest = [
    'Computer Science',
    'Engineering',
    'Medicine',
    'Business Administration',
    'Law',
    'Arts & Humanities',
    'Natural Sciences',
    'Social Sciences',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Psychology',
    'Education',
    'Architecture',
    'Agriculture',
    'Pharmacy',
    'Nursing',
    'Other'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {isSignUp ? 'Join College' : 'Sign In to College'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              {isSignUp ? 'Join EduConnect' : 'Sign In to EduConnect'}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {isSignUp 
                ? 'Create your account to access personalized education resources'
                : 'Access your personalized education dashboard'
              }
            </Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Mail size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Lock size={20} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            )}
          </View>

          {/* Sign Up Additional Fields */}
          {isSignUp && (
            <>
              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  </View>
                )}
              </View>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={[styles.inputContainer, errors.fullName && styles.inputError]}>
                  <User size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={formData.fullName}
                    onChangeText={(text) => handleInputChange('fullName', text)}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />
                </View>
                {errors.fullName && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.fullName}</Text>
                  </View>
                )}
              </View>

              {/* High School Information */}
              <View style={styles.sectionHeader}>
                <GraduationCap size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>High School Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>High School Name *</Text>
                <View style={[styles.inputContainer, errors.highSchoolName && styles.inputError]}>
                  <GraduationCap size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={formData.highSchoolName}
                    onChangeText={(text) => handleInputChange('highSchoolName', text)}
                    placeholder="e.g., Achimota School, Wesley Girls' High School"
                    autoCapitalize="words"
                  />
                </View>
                {errors.highSchoolName && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.highSchoolName}</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>High School Location *</Text>
                <View style={[styles.inputContainer, errors.highSchoolLocation && styles.inputError]}>
                  <MapPin size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={formData.highSchoolLocation}
                    onChangeText={(text) => handleInputChange('highSchoolLocation', text)}
                    placeholder="e.g., Accra, Ghana"
                    autoCapitalize="words"
                  />
                </View>
                {errors.highSchoolLocation && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.highSchoolLocation}</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Graduation Year *</Text>
                <View style={[styles.inputContainer, errors.graduationYear && styles.inputError]}>
                  <Calendar size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    value={formData.graduationYear}
                    onChangeText={(text) => handleInputChange('graduationYear', text)}
                    placeholder="e.g., 2023"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
                {errors.graduationYear && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.graduationYear}</Text>
                  </View>
                )}
              </View>

              {/* Current Education Level */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current Education Level *</Text>
                <View style={styles.pickerContainer}>
                  {educationLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.pickerOption,
                        formData.currentEducationLevel === level && styles.selectedPickerOption
                      ]}
                      onPress={() => handleInputChange('currentEducationLevel', level)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.currentEducationLevel === level && styles.selectedPickerOptionText
                      ]}>
                        {level}
                      </Text>
                      {formData.currentEducationLevel === level && (
                        <CheckCircle size={16} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.currentEducationLevel && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{errors.currentEducationLevel}</Text>
                  </View>
                )}
              </View>

              {/* Field of Interest */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Field of Interest (Optional)</Text>
                <View style={styles.pickerContainer}>
                  {fieldsOfInterest.map((field) => (
                    <TouchableOpacity
                      key={field}
                      style={[
                        styles.pickerOption,
                        formData.fieldOfInterest === field && styles.selectedPickerOption
                      ]}
                      onPress={() => handleInputChange('fieldOfInterest', field)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.fieldOfInterest === field && styles.selectedPickerOptionText
                      ]}>
                        {field}
                      </Text>
                      {formData.fieldOfInterest === field && (
                        <CheckCircle size={16} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={isSignUp ? handleSignUp : handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Switch Mode */}
          <View style={styles.switchModeContainer}>
            <Text style={styles.switchModeText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={switchMode}>
              <Text style={styles.switchModeLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Privacy */}
          {isSignUp && (
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  pickerOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  switchModeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  switchModeLink: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  termsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
  },
  termsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontFamily: 'Inter-SemiBold',
  },
});