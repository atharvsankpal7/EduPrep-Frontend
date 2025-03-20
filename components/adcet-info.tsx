"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  GraduationCap,
  Info,
  BookOpen,
  Briefcase,
  Star,
  Globe,
  Phone,
  CopyrightIcon,
  X,
} from "lucide-react";
import Image from "next/image";

interface Props {}

const AdcetInfo = () => {
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    {
      href: "/test/junior-college/cet",
      icon: GraduationCap,
      alt: "Mock Test",
      label: "Mock Test",
    },
    {
      href: "/about",
      icon: Info,
      alt: "About Us",
      label: "About Us",
    },
    {
      href: "/programs",
      icon: BookOpen,
      alt: "Programs",
      label: "Programs",
    },
    {
      href: "/placements",
      icon: Briefcase,
      alt: "Placements",
      label: "Placements",
    },
    {
      href: "/reviews",
      icon: Star,
      alt: "Reviews",
      label: "Reviews",
    },
    {
      href: "https://www.adcet.ac.in",
      icon: Globe,
      alt: "Visit Website",
      label: "Visit Website",
    },
  ];

  const MenuItem = ({
    href,
    icon: Icon,
    alt,
    label,
  }: {
    href: string;
    icon: any;
    alt: string;
    label: string;
  }) => (
    <Link
      href={href}
      className="flex flex-col items-center p-4 bg-white rounded-lg border  border-1 border-slate-500 transition-shadow"
    >
      <div className="w-12 h-12 mb-2 flex items-center justify-center">
        <Icon size={32} className="text-blue-500" />
      </div>
      <span className="text-sm font-medium text-slate-950">{label}</span>
    </Link>
  );
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <div className="text-center p-4 space-y-2">
        <Image
          src="https://www.adcet.ac.in/uploads/1676968661.png"
          alt="ADCET Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
        <div className="space-y-1">
          <p className="text-sm">Sant Dnyaneshwar Shikshan Sanstha&apos;s</p>
          <h1 className="text-lg font-bold text-blue-900">
            Annasaheb Dange College of Engineering and Technology (ADCET), Ashta
          </h1>
          <p className="text-sm text-gray-600">
            An Empowered Autonomous institute, Affiliated to Shivaji University,
            Kolhapur, Approved By AICTE, New Delhi & Govt. of Maharashtra
          </p>
          <div className="text-green-700 font-semibold text-sm">
            <p>Accredited by NAAC &apos;A++&apos; Grade, Bangalore</p>
            <p>Eligible Programs Accredited by NBA, New Delhi</p>
          </div>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            href={item.href}
            icon={item.icon}
            alt={item.alt}
            label={item.label}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-auto p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">Contact Us</h2>
        <p className="text-sm text-gray-600 mb-4">
          A/P: Ashta, Tal: Walwa, Dist: Sangli, Maharashtra, India - 416301
        </p>
        <div className="h-48 w-full rounded-lg overflow-hidden mb-4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.4711947989086!2d74.41702511142599!3d16.941714610788097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1524e1c1f8a55%3A0x7cc3eff1560a3c39!2sADCET%20Ashta!5e0!3m2!1sen!2sin!4v1647887842014!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>{" "}
        </div>
      </div>

      {/* Floating Call Button */}
      <a
        href="tel:+91-8600600700"
        className="fixed bottom-4 right-4 bg-blue-800 text-white rounded-full p-4 shadow-lg hover:bg-blue-900 transition-colors"
      >
        <Phone className="h-6 w-6" />
      </a>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 right-24 bg-blue-800 text-white rounded-full p-4 shadow-lg hover:bg-blue-900 transition-colors"
      >
        <CopyrightIcon className="h-6 w-6" />
      </button>

      {/* Copyright Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">
              EduPrep&apos;s Development Team
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black">Project Guide</h3>
                <p className="text-black">Dr. A.J.Shikalgar</p>
              </div>
              <div>
                <h3 className="font-semibold text-black">Team Members</h3>
                <ul className="list-disc list-inside text-black">
                  <li>
                    <a
                      href="https://www.linkedin.com/in/atharv-sankpal-235a7730a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Atharv Santosh Sankpal
                    </a>
                  </li>
                  <li>Vaishnavi Rajarm Sutar</li>
                  <li>Shrinath Hanmant Dongare</li>
                  <li>Mansi Manohar Sawant</li>
                </ul>
              </div>
              <div className="text-center text-sm text-black mt-6">
                <p>© 2025 EduPrep Mobile App. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdcetInfo;
