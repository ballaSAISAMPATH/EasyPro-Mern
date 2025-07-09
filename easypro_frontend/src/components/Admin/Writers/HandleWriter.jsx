import { useEffect, useState } from "react";
import {
	Plus,
	X,
	User,
	BookOpen,
	Save,
	Camera,
	GraduationCap,
	Code,
	Edit
} from 'lucide-react';

const HandleWriter = ({
	isOpen,
	onClose,
	onSubmit,
	writer,
	setWriter,
	submitting,
	isEdit = false
}) => {
	const [profilePicPreview, setProfilePicPreview] = useState('');
	const [isImageChanged, setIsImageChanged] = useState(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setWriter(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setWriter(prev => ({
				...prev,
				profilePic: file
			}));
			setIsImageChanged(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfilePicPreview(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSkillChange = (index, field, value) => {
		const newSkills = [...writer.skills];
		newSkills[index] = { ...newSkills[index], [field]: value };
		setWriter(prev => ({ ...prev, skills: newSkills }));
	};

	const addSkill = () => {
		setWriter(prev => ({
			...prev,
			skills: [...prev.skills, { skill: '', experience: 0 }]
		}));
	};

	const removeSkill = (index) => {
		if (writer.skills.length > 1) {
			const newSkills = writer.skills.filter((_, i) => i !== index);
			setWriter(prev => ({ ...prev, skills: newSkills }));
		}
	};

	const handleFamiliarWithChange = (index, value) => {
		const newFamiliarWith = [...writer.familiarWith];
		newFamiliarWith[index] = value;
		setWriter(prev => ({ ...prev, familiarWith: newFamiliarWith }));
	};

	const addFamiliarWith = () => {
		setWriter(prev => ({
			...prev,
			familiarWith: [...prev.familiarWith, '']
		}));
	};

	const removeFamiliarWith = (index) => {
		if (writer.familiarWith.length > 1) {
			const newFamiliarWith = writer.familiarWith.filter((_, i) => i !== index);
			setWriter(prev => ({ ...prev, familiarWith: newFamiliarWith }));
		}
	};

	const handleEducationChange = (index, field, value) => {
		const newEducation = [...writer.education];
		newEducation[index] = { ...newEducation[index], [field]: value };
		setWriter(prev => ({ ...prev, education: newEducation }));
	};

	const addEducation = () => {
		setWriter(prev => ({
			...prev,
			education: [...prev.education, {
				qualification: '',
				place: '',
				startYear: new Date().getFullYear(),
				endYear: new Date().getFullYear(),
				grade: ''
			}]
		}));
	};

	const removeEducation = (index) => {
		if (writer.education.length > 1) {
			const newEducation = writer.education.filter((_, i) => i !== index);
			setWriter(prev => ({ ...prev, education: newEducation }));
		}
	};

	useEffect(() => {
		if (isEdit && writer.profilePic && typeof writer.profilePic === 'string') {
			setProfilePicPreview(writer.profilePic);
			setIsImageChanged(false);
		} else if (writer.profilePic instanceof File) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfilePicPreview(reader.result);
			};
			reader.readAsDataURL(writer.profilePic);
		} else {
			setProfilePicPreview('');
		}
	}, [writer.profilePic, isEdit]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
				{/* Modal Header */}
				<div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
					<h2 className="text-xl font-bold text-white">
						{isEdit ? 'Edit Writer' : 'Add New Writer'}
					</h2>
					<button
						onClick={onClose}
						className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Modal Content */}
				<div className="overflow-y-auto max-h-[calc(90vh-80px)]">
					<div className="p-6">
						{/* Profile Picture */}
						<div className="flex justify-center mb-8">
							<div className="relative">
								<div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
									{profilePicPreview ? (
										<img
											src={profilePicPreview}
											alt="Profile preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<User size={48} className="text-white" />
									)}
								</div>
								<label
									htmlFor="profilePic"
									className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg transform hover:scale-110"
								>
									{isEdit ? <Edit size={20} /> : <Camera size={20} />}
								</label>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
									id="profilePic"
								/>
							</div>
						</div>

						<div className="space-y-6">
							{/* Basic Information */}
							<div className="bg-gray-50 rounded-xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
									<User className="w-5 h-5 text-blue-600" />
									Basic Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label className="block text-sm font-medium text-gray-700">
											Full Name *
										</label>
										<input
											type="text"
											name="fullName"
											value={writer.fullName}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
											placeholder="Enter full name"
										/>
									</div>

									<div className="space-y-2">
										<label className="block text-sm font-medium text-gray-700">
											Email Address *
										</label>
										<input
											type="email"
											name="email"
											value={writer.email}
											onChange={handleInputChange}
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
											placeholder="Enter email address"
										/>
									</div>
								</div>

								<div className="space-y-2 mt-4">
									<label className="block text-sm font-medium text-gray-700">
										Bio
									</label>
									<textarea
										name="bio"
										value={writer.bio}
										onChange={handleInputChange}
										rows={4}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
										placeholder="Tell us about this writer..."
									/>
								</div>
							</div>

							{/* Skills */}
							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
										<Code className="w-5 h-5 text-purple-600" />
										Skills *
									</h3>
									<button
										type="button"
										onClick={addSkill}
										className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
									>
										<Plus className="w-4 h-4" />
										Add Skill
									</button>
								</div>
								<div className="space-y-3">
									{writer.skills.map((skill, index) => (
										<div key={index} className="flex gap-3 items-end">
											<div className="flex-1 space-y-2">
												<label className="block text-sm font-medium text-gray-700">
													Skill
												</label>
												<input
													type="text"
													value={skill.skill}
													onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
													required
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
													placeholder="e.g., Content Writing"
												/>
											</div>
											<div className="w-32 space-y-2">
												<label className="block text-sm font-medium text-gray-700">
													Years
												</label>
												<input
													type="number"
													value={skill.experience}
													onChange={(e) => handleSkillChange(index, 'experience', parseInt(e.target.value) || 0)}
													required
													min="0"
													className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
													placeholder="Years"
												/>
											</div>
											{writer.skills.length > 1 && (
												<button
													type="button"
													onClick={() => removeSkill(index)}
													className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors mb-0"
												>
													<X className="w-4 h-4" />
												</button>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Familiar With */}
							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
										<BookOpen className="w-5 h-5 text-green-600" />
										Familiar With
									</h3>
									<button
										type="button"
										onClick={addFamiliarWith}
										className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
									>
										<Plus className="w-4 h-4" />
										Add Item
									</button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{writer.familiarWith.map((item, index) => (
										<div key={index} className="flex gap-2">
											<input
												type="text"
												value={item}
												onChange={(e) => handleFamiliarWithChange(index, e.target.value)}
												className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
												placeholder="Technology, framework, or tool"
											/>
											{writer.familiarWith.length > 1 && (
												<button
													type="button"
													onClick={() => removeFamiliarWith(index)}
													className="text-red-600 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-colors"
												>
													<X className="w-4 h-4" />
												</button>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Education */}
							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
										<GraduationCap className="w-5 h-5 text-indigo-600" />
										Education *
									</h3>
									<button
										type="button"
										onClick={addEducation}
										className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
									>
										<Plus className="w-4 h-4" />
										Add Education
									</button>
								</div>
								<div className="space-y-4">
									{writer.education.map((edu, index) => (
										<div key={index} className="border border-gray-200 rounded-xl p-4 bg-white">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
												<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														Qualification *
													</label>
													<input
														type="text"
														value={edu.qualification}
														onChange={(e) => handleEducationChange(index, 'qualification', e.target.value)}
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
														placeholder="e.g., Bachelor's Degree"
													/>
												</div>
												<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														Institution *
													</label>
													<input
														type="text"
														value={edu.place}
														onChange={(e) => handleEducationChange(index, 'place', e.target.value)}
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
														placeholder="Institution name"
													/>
												</div>
											</div>
											<div className="grid grid-cols-3 gap-4">
												<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														Start Year *
													</label>
													<input
														type="number"
														value={edu.startYear}
														onChange={(e) => handleEducationChange(index, 'startYear', parseInt(e.target.value) || new Date().getFullYear())}
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
														min="1950"
														max="2030"
													/>
												</div>
												<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														End Year *
													</label>
													<input
														type="number"
														value={edu.endYear}
														onChange={(e) => handleEducationChange(index, 'endYear', parseInt(e.target.value) || new Date().getFullYear())}
														required
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
														min="1950"
														max="2030"
													/>
												</div>
												<div className="space-y-2">
													<label className="block text-sm font-medium text-gray-700">
														Grade/GPA
													</label>
													<input
														type="text"
														value={edu.grade}
														onChange={(e) => handleEducationChange(index, 'grade', e.target.value)}
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
														placeholder="Grade/GPA"
													/>
												</div>
												{writer.education.length > 1 && (
													<button
														type="button"
														onClick={() => removeEducation(index)}
														className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
													>
														<X className="w-4 h-4" />
														Remove Education
													</button>
												)}
											</div>
										</div>
									))}
								</div>

								{/* Form Actions */}
								<div className="flex gap-3 pt-4">
									<button
										type="button"
										onClick={() => onSubmit(isImageChanged)}
										disabled={submitting}
										className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${submitting ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										{submitting ? (
											<div className="flex items-center gap-2">
												<span className="w-4 h-4 border-2 border-x-gray-500 border-white rounded-full animate-spin" />
												{isEdit ? 'Updating...' : 'Saving...'}
											</div>
										) : (
											<>
												<Save className="w-5 h-5" />
												{isEdit ? 'Update Writer' : 'Save Writer'}
											</>
										)}
									</button>
									<button
										type="button"
										onClick={onClose}
										className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HandleWriter;