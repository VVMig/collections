import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import * as Icon from 'react-bootstrap-icons'

function Filter({ filter, setFilter }) {
    const { collection }  = useSelector(state => state.collection.collection)
    const pictureCheck = useRef()

    function reset() {
        const clearObj = {}

        for (const key in filter) {
            clearObj[key] = key === 'apply' ? filter[key] : undefined
        }

        pictureCheck.current.checked = false

        setFilter({...clearObj})
    }

    return (
        <div className="d-flex align-items-center flex-column mb-3 col-6">
            <button className="btn btn-primary mb-2 ml-auto" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                <Icon.FunnelFill/>
            </button>

            <div className="collapse w-100" id="collapseExample">
                <div className="card card-body">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Title</span>
                        </div>
                        <input value={filter.title || ''} type="text" className="form-control" onChange={(e) => setFilter({...filter, title: e.target.value})} placeholder="Title" aria-describedby="basic-addon1"/>
                    </div>
                    {collection.author && <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Author</span>
                        </div>
                        <input value={filter.author || ''} onChange={(e) => setFilter({...filter, author: e.target.value})} type="text" className="form-control" placeholder="Author" aria-describedby="basic-addon1"/>
                    </div>}
                    {collection.year && <div className="d-flex align-items-center mb-3">
                        <input value={(filter.dateFrom && new Date(filter.dateFrom).toISOString().substr(0, 10)) || ''} type="date" onChange={(e) => setFilter({...filter, dateFrom: new Date(e.target.value)})} className="form-control"/>
                        <span className="mx-2">-</span>
                        <input value={(filter.dateTo && new Date(filter.dateTo).toISOString().substr(0, 10)) || ''} type="date" onChange={(e) => setFilter({...filter, dateTo: new Date(e.target.value)})} className="form-control"/>
                    </div>}
                    <div className="form-check mb-3">
                        <input ref={pictureCheck} onChange={(e) => setFilter({...filter, picture: e.target.checked})} className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                        <label className="form-check-label" htmlFor="defaultCheck1">
                            Picture
                        </label>
                    </div>
                    <div className="d-flex custom-control custom-switch justify-content-end">
                        <input defaultValue={false} type="checkbox" onChange={(e) => setFilter({...filter, apply: e.target.checked})} className="custom-control-input" id="customSwitch1"/>
                        <label className="custom-control-label" htmlFor="customSwitch1">Apply</label>
                    </div>
                    <button className="btn btn-danger" onClick={reset}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Filter