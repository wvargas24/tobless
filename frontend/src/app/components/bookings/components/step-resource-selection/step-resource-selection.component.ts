import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Resource, ResourceService } from 'src/app/components/resources/services/resource.service';

@Component({
    selector: 'app-step-resource-selection',
    templateUrl: './step-resource-selection.component.html',
})
export class StepResourceSelectionComponent implements OnInit {
    resources: Resource[] = [];
    @Output() resourceSelected = new EventEmitter<Resource>();

    constructor(private resourceService: ResourceService) { }

    ngOnInit(): void {
        // Obtenemos solo los recursos que el usuario puede reservar
        this.resourceService.getBookableResources().subscribe(data => {
            this.resources = data;
        });
    }

    selectResource(resource: Resource): void {
        // Emitimos el evento al componente padre
        this.resourceSelected.emit(resource);
    }
}
