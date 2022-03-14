import { CdkDragMove } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { MyShortcutDialogComponent } from './components/my-shortcut-dialog/my-shortcut-dialog.component';
import { IShortcut, IShortcutDropped, shortcutsData } from './my-shortcut.model';

@Component({
  selector: 'cms-next-my-shortcut',
  templateUrl: './my-shortcut.component.html',
  styleUrls: ['./my-shortcut.component.scss'],
})
export class MyShortcutComponent implements OnInit, AfterViewInit, OnDestroy {
  shortcutsData: string[] = [];
  myShortcuts: IShortcut[];
  activeShortcuts = [] as IShortcut[];
  destroy$ = new Subject();

  constructor(private dialog: MatDialog, private settingWebsiteService: SettingWebsiteService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.myShortcuts = [...shortcutsData];
    this.onGetConfigShortcuts();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  onGetConfigShortcuts(): void {
    this.settingWebsiteService
      .getConfigShortcuts()
      .pipe(
        takeUntil(this.destroy$),
        tap((shortcuts) => {
          if (shortcuts) {
            this.shortcutsData = shortcuts;
            this.onRederdingActiveShortcut(this.shortcutsData);
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot Connect To Config Shotcuts',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onGetConfigShortcuts :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onSaveConfigShortcuts(shortcuts: string[]): void {
    this.settingWebsiteService
      .saveConfigShortcuts(shortcuts)
      .pipe(
        takeUntil(this.destroy$),
        tap((results) => {
          if (results?.status !== 200) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: results?.value,
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onSaveConfigShortcuts :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  drop(event: IShortcutDropped): void {
    const dropItem: IShortcut = event.container.data.item;
    if (dropItem.isDefault) return;
    this.activeShortcuts[event.previousContainer.data.index] = event.container.data.item;
    this.activeShortcuts[event.container.data.index] = event.previousContainer.data.item;
    this.onSaveConfigShortcuts(this.onGetShortcuts(this.activeShortcuts));
  }

  dragMoved(event: CdkDragMove): void {
    event.source.entered.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      const dropItem: IShortcut = val?.container?.data?.item;
      const dropItemElement = val.container.element.nativeElement as HTMLElement;
      if (dropItem.isDefault) {
        dropItemElement.classList.add('default-position');
      }
    });
    event.source.exited.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      const dropItem: IShortcut = val?.container?.data?.item;
      const dropItemElement = val.container.element.nativeElement as HTMLElement;
      if (dropItem.isDefault) {
        dropItemElement.classList.remove('default-position');
      }
    });
    event.source.dropped.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      const dropItem: IShortcut = val?.container?.data?.item;
      const dropItemElement = val.container.element.nativeElement as HTMLElement;
      if (dropItem.isDefault) {
        dropItemElement.classList.remove('default-position');
      }
    });
  }

  onRederdingActiveShortcut(shortcutData: string[]): void {
    this.activeShortcuts = [];
    shortcutData.forEach((key) => {
      this.activeShortcuts.push(this.getMyShotcut(key));
    });
  }

  getMyShotcut(key: string): IShortcut {
    let foundShortcut: IShortcut = null;
    this.myShortcuts.forEach((shortcut) => {
      if (shortcut.title === key) {
        shortcut.isActive = true;
        foundShortcut = shortcut;
        return;
      }
      if (shortcut.childNode.length) {
        shortcut.childNode.forEach((child) => {
          if (child.title === key) {
            shortcut.isToggle = true;
            child.isActive = true;
            foundShortcut = child;
            return;
          }
        });
      }
    });
    return foundShortcut;
  }

  onRemoveActiveShortcut(index: number): void {
    const foundId = this.activeShortcuts[index].shortcutId;
    this.myShortcuts.forEach((shortcut) => {
      if (shortcut.shortcutId === foundId) {
        shortcut.isActive = false;
      }
      if (shortcut.childNode.length) {
        shortcut.childNode.forEach((child) => {
          if (child.shortcutId === foundId) {
            child.isActive = false;
          }
        });
      }
    });
    this.activeShortcuts.splice(index, 1);
    this.onSaveConfigShortcuts(this.onGetShortcuts(this.activeShortcuts));
  }

  trackByIndex(index: number): number {
    return index;
  }

  onShortcutDialog(): void {
    const dialogRef = this.dialog.open(MyShortcutDialogComponent, {
      minWidth: '320px',
      data: this.myShortcuts,
    });

    dialogRef.afterClosed().subscribe((result: IShortcut[]) => {
      if (result) {
        this.myShortcuts = result;
        this.setActiveShortcuts();
        this.onSaveConfigShortcuts(this.onGetShortcuts(this.activeShortcuts));
      }
    });
  }

  setActiveShortcuts(): void {
    this.activeShortcuts = [];
    this.myShortcuts.forEach((shortcut) => {
      if (shortcut.isActive && !shortcut.childNode.length) {
        this.activeShortcuts.push(shortcut);
      }
      if (shortcut.childNode.length) {
        shortcut.childNode.forEach((child) => {
          if (child.isActive) {
            this.activeShortcuts.push(child);
          }
        });
      }
    });
    this.activeShortcuts.sort(({ isDefault }) => (isDefault ? -1 : 1));
  }

  onGetShortcuts(activeShortcuts: IShortcut[]): string[] {
    const shortcuts = activeShortcuts.map((val) => val.title);
    return shortcuts;
  }
}
