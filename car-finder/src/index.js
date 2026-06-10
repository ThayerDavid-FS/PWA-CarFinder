// Imports your SCSS stylesheet
import './styles/index.scss';
import data from '../car-dataset.json';


class VehicleData {
    constructor(jsonData){


        if (Array.isArray(jsonData)) {
            this.data = jsonData;
        } else if (jsonData && typeof jsonData === 'object') {
            const potentialArray = Object.values(jsonData).find(val => Array.isArray(val));
            this.data = potentialArray || (jsonData.default && Array.isArray(jsonData.default) ? jsonData.default : []);
        } else {
            this.data = [];
        }

        
    }
    
    
        getYears(){
             const years = this.data.map(item => item && item.year ? item.year.toString() : null);
            return [...new Set(years)]
            .filter(year => year && year !== 'default')
            .sort((a, b) => b - a);
           
        }
        
        getMakes(year){
            console.log(`Getting makes for year: ${year}`);

            const makes = this.data
                .filter(item => item.year && item.year.toString() === year)
                .map(item => item.make);
            return [...new Set(makes)].sort();
        }
        
        getModels(year, make){
            const models = this.data
                .filter(item => item.year && item.year.toString() === year && item.make === make)
                .map(item => item.model)
                .filter(model => model && model !== 'default');
            return [...new Set(models)].sort();
        }

}

class VehicleController {
    constructor(dataLoader){
        this.dataLoader = dataLoader;
        this.yearSelect = document.getElementById('yearSelect');
        this.makeSelect = document.getElementById('makeSelect');
        this.modelSelect = document.getElementById('modelSelect');
    }

     init(){
        
        this.populateYears();
        this.attachEvents();
    }

    populateYears(){
        const years = this.dataLoader.getYears();

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            this.yearSelect.appendChild(option);
        });
    }

    attachEvents(){
        this.yearSelect.addEventListener('change', () => {
            const selectedYear = this.yearSelect.value;
            this.populateMakes(selectedYear);
            this.resetModels();
        });

        this.makeSelect.addEventListener('change', () => {
            const selectedYear = this.yearSelect.value;
            const selectedMake = this.makeSelect.value;
            this.populateModels(selectedYear, selectedMake);
        });
    }
        populateMakes(year){
            const makes = this.dataLoader.getMakes(year);
            
            this.makeSelect.innerHTML = '<option value="">Select Make</option>';
            this.resetModels();

            if (makes.length === 0) {
                this.makeSelect.disabled = true;
                return;
            }

            makes.forEach(make => {
                const option = document.createElement('option');
                option.value = make;
                option.textContent = make;
                this.makeSelect.appendChild(option);
            });
            this.makeSelect.disabled = false;
        };

        populateModels(year, make){
            const models = this.dataLoader.getModels(year, make);

            this.modelSelect.innerHTML = '<option value="">Select Model</option>';
            
            if (models.length === 0) {
                this.modelSelect.disabled = true;
                return;
            }

            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                this.modelSelect.appendChild(option);
            });

            this.modelSelect.disabled = false;
        };
        
        resetModels(){
            this.modelSelect.innerHTML = '<option value="">Select Model</option>';
            this.modelSelect.disabled = true;
        }
    }

document.addEventListener('DOMContentLoaded', () => {
    const dataLoader = new VehicleData(data);
    const controller = new VehicleController(dataLoader);

    controller.init();
}
);
