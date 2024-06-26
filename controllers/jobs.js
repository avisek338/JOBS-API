
const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadrequestError, NotFoundError} = require('../errors')
const { findByIdAndDelete } = require('../models/User')

const getAllJobs = async(req,res)=>{
   const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
   res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}
const getJob = async(req,res)=>{
    const jobid = req.params.id
    const userId = req.user.userId
    const job = await Job.find({_id:jobid,createdBy:userId})
    if(job.length == 0){
        throw new NotFoundError(`No job with id ${jobid}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const deleteJob = async(req,res)=>{
    const userId = req.user.userId
    const jobId = req.params.id
    const job = await Job.findByIdAndDelete({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const updateJob = async(req,res)=>{
    const userId = req.user.userId
    const jobId = req.params.id
    const {company,position} = req.body
    if(company == '' || position==''){
        throw new BadrequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    res.status(StatusCodes.OK).json({job})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    deleteJob,
    updateJob
}