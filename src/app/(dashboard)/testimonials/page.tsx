'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Heart, MessageSquare, Star } from 'lucide-react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://via.placeholder.com/60',
      text: 'Empire of Forex has transformed my trading journey. The signals are accurate and timely. Highly recommended!',
      rating: 5,
      profit: 15000,
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'https://via.placeholder.com/60',
      text: 'Best investment platform I\'ve used. The ROI has been consistent and the support team is always helpful.',
      rating: 5,
      profit: 25000,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://via.placeholder.com/60',
      text: 'I started with a small investment and now I\'m making excellent returns. The platform is user-friendly and secure.',
      rating: 5,
      profit: 8500,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-gray-600 mt-1">Success stories from our community</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} hover>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-4">{testimonial.text}</p>

            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <p className="text-gray-600 text-xs">Total Profit</p>
              <p className="text-2xl font-bold text-green-600">${testimonial.profit.toLocaleString()}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
                <Heart className="w-4 h-4" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">Reply</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
