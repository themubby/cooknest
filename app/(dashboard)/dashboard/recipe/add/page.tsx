"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Define a strict TypeScript type for your form state
interface FormValues {
  title: string;
  duration: string;
  category: string;
  ingredients: string;
  rating: number;
}

// Fixed validation signature to accept all FormValues safely
const validate = (values: FormValues) => {
  const errors: Record<string, string> = {};

  if (!values.title) {
    errors.title = 'Recipe title is required';
  } else if (values.title.length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!values.duration) {
    errors.duration = 'Cooking duration is required';
  }

  if (!values.category) {
    errors.category = 'Please select a valid category option';
  }

  if (!values.ingredients) {
    errors.ingredients = 'Ingredients list cannot be empty';
  }

  return errors;
};

export default function AddNewRecipePage() {
  const [isSubmittingToDb, setIsSubmittingToDb] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Completed Formik initialization with the required onSubmit handler
  const formik = useFormik<FormValues>({
    initialValues: {
      title: '',
      duration: '',
      category: '',
      ingredients: '',
      rating: 5.0
    },
    validate,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmittingToDb(true);
      setSubmitSuccess(false);
      
      try {
       
        await addDoc(collection(db, "recipes"), {
          title: values.title,
          duration: values.duration,
          category: values.category,
          ingredients: values.ingredients.split('\n').filter(i => i.trim() !== ''),
          rating: values.rating,
          createdAt: new Date().toISOString()
        });

        setSubmitSuccess(true);
        resetForm();
      } catch (error) {
        console.error("Firebase Execution Error: ", error);
        alert("Failed to sync structural document data up to the live Firestore collection node.");
      } finally {
        setIsSubmittingToDb(false);
      }
    },
  });

  return (
    <div className="space-y-6 max-w-2xl transition-colors duration-200">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Add New Recipe</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Create and persist a new cooking creation inside your private cloud ledger.</p>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-4xl p-6 sm:p-8 shadow-sm transition-colors">
        
        {submitSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            🎉 Recipe successfully recorded in your database timeline!
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Recipe Name Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              placeholder="e.g. Avocado Crunch Toast"
              className={`w-full px-5 py-3.5 border rounded-2xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all ${
                formik.touched.title && formik.errors.title 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-800 focus:border-orange-500'
              }`}
            />
            {formik.touched.title && formik.errors.title ? (
              <span className="text-xs font-bold text-red-500 mt-1.5 block px-1">⚠️ {formik.errors.title}</span>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Duration Input */}
            <div>
              <label htmlFor="duration" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Duration Time
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.duration}
                placeholder="e.g. 25 mins"
                className={`w-full px-5 py-3.5 border rounded-2xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all ${
                  formik.touched.duration && formik.errors.duration 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-800 focus:border-orange-500'
                }`}
              />
              {formik.touched.duration && formik.errors.duration ? (
                <span className="text-xs font-bold text-red-500 mt-1.5 block px-1">⚠️ {formik.errors.duration}</span>
              ) : null}
            </div>

            {/* Category Dropdown Selection */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                Food Category
              </label>
              <select
                id="category"
                name="category"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.category}
                className={`w-full px-5 py-3.5 border rounded-2xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white outline-none cursor-pointer transition-all ${
                  formik.touched.category && formik.errors.category 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 dark:border-gray-800 focus:border-orange-500'
                }`}
              >
                <option value="">Select a category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Desserts">Desserts</option>
              </select>
              {formik.touched.category && formik.errors.category ? (
                <span className="text-xs font-bold text-red-500 mt-1.5 block px-1">⚠️ {formik.errors.category}</span>
              ) : null}
            </div>
          </div>

          {/* Ingredients Textarea */}
          <div>
            <label htmlFor="ingredients" className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Ingredients List (one item per line)
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows={5}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.ingredients}
              placeholder="2 Slices of Sourdough Bread&#10;1 Ripe Fresh Avocado&#10;Pinch of Chili Flakes"
              className={`w-full px-5 py-3.5 border rounded-2xl bg-gray-50/50 dark:bg-gray-950 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all ${
                formik.touched.ingredients && formik.errors.ingredients 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-200 dark:border-gray-800 focus:border-orange-500'
              }`}
            />
            {formik.touched.ingredients && formik.errors.ingredients ? (
              <span className="text-xs font-bold text-red-500 mt-1.5 block px-1">⚠️ {formik.errors.ingredients}</span>
            ) : null}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingToDb}
              className="w-full sm:w-auto px-10 py-3.5 bg-orange-500 text-white font-bold text-sm rounded-full hover:bg-orange-600 shadow-sm shadow-orange-500/10 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingToDb ? "Saving to Cloud..." : "Add Recipe"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}