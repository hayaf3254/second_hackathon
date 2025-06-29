import { defineStore } from 'pinia'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    resumeData: {
      universityName: '',
      facultyName: '',
      departmentName: '',
      highSchoolGraduationYear: '',
      highSchoolGraduationMonth: '',
      universityEntranceYear: '',
      universityEntranceMonth: '',
      universityGraduationYear: '',
      universityGraduationMonth: '',
      generatedWorkHistory: ''
    },
    selfPRData: {
      userStrengths: [],
      experienceContext: '',
      effortDetails: '',
      desiredRole: '',
      generatedSelfPR: ''
    }
  }),
  
  actions: {
    setResumeData(data) {
      this.resumeData = { ...data }
    },
    
    setSelfPRData(data) {
      this.selfPRData = { ...data }
    },
    
    clearAllData() {
      this.resumeData = {
        universityName: '',
        facultyName: '',
        departmentName: '',
        highSchoolGraduationYear: '',
        highSchoolGraduationMonth: '',
        universityEntranceYear: '',
        universityEntranceMonth: '',
        universityGraduationYear: '',
        universityGraduationMonth: '',
        generatedWorkHistory: ''
      }
      this.selfPRData = {
        userStrengths: [],
        experienceContext: '',
        effortDetails: '',
        desiredRole: '',
        generatedSelfPR: ''
      }
    }
  },
  
  getters: {
    hasResumeData: (state) => !!state.resumeData.generatedWorkHistory,
    hasSelfPRData: (state) => !!state.selfPRData.generatedSelfPR,
    hasCompleteData: (state) => !!state.resumeData.generatedWorkHistory && !!state.selfPRData.generatedSelfPR
  }
}) 